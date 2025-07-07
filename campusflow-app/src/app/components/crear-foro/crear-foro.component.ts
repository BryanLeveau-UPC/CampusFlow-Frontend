import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GrupoForo } from '../../model/grupoForo';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { Asignatura } from '../../model/asignatura';
import { Carrera } from '../../model/carrera';
import { AsignaturaService } from '../../services/asignatura.service';
import { GrupoForoService } from '../../services/grupo-foro.service';
import { AuthService } from '../../services/auth.service';
import { CarreraService } from '../../services/carrera.service';

@Component({
  selector: 'app-crear-foro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './crear-foro.component.html',
  styleUrl: './crear-foro.component.css',
})
export class CrearForoProfesorComponent implements OnInit {

  foroForm!: FormGroup;

  carreras: Carrera[] = []; // List of careers to be loaded
  ciclos: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  asignaturas: Asignatura[] = [];

  isLoadingCarreras: boolean = false; // New: for career loading state
  isLoadingAsignaturas: boolean = false;

  constructor(
    private fb: FormBuilder,
    private asignaturaService: AsignaturaService,
    private grupoForoService: GrupoForoService,
    private carreraService: CarreraService, // Re-inject CarreraService
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCarreras(); // Load careers from backend

    // Listen to changes in both career and cycle selectors
    this.foroForm.get('selectedCarreraId')?.valueChanges.subscribe(() => this.onCarreraCicloChange());
    this.foroForm.get('selectedCiclo')?.valueChanges.subscribe(() => this.onCarreraCicloChange());
  }

  private initForm(): void {
    this.foroForm = this.fb.group({
      selectedCarreraId: [null, Validators.required], // Re-add career control
      selectedCiclo: [null, Validators.required],
      selectedAsignaturaId: [null, Validators.required],
      Titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      Descripcion: ['', [Validators.required, Validators.minLength(10)]],
      Campo: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  /**
   * Loads careers from the backend using CarreraService.
   */
  private loadCarreras(): void {
    this.isLoadingCarreras = true;
    this.carreraService.listar() // Assuming 'listar()' is the correct method in CarreraService
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackBar.open(`Error loading careers: ${error.message || 'Unknown error'}`, 'Close', { duration: 5000 });
          this.isLoadingCarreras = false;
          return throwError(() => new Error(error.message || 'Unknown error loading careers.'));
        })
      )
      .subscribe(
        (data: Carrera[]) => {
          this.carreras = data;
          this.isLoadingCarreras = false;
          if (this.carreras.length === 0) {
            this.snackBar.open('No careers found.', 'Close', { duration: 3000 });
          }
        }
      );
  }

  /**
   * Logic to load subjects when career or cycle changes.
   * Uses the selected career ID and the selected cycle.
   */
  onCarreraCicloChange(): void {
    const selectedCarreraId = this.foroForm.get('selectedCarreraId')?.value;
    const selectedCiclo = this.foroForm.get('selectedCiclo')?.value;

    this.asignaturas = []; // Clear previous subjects
    this.foroForm.get('selectedAsignaturaId')?.patchValue(null); // Clear subject selection

    // Load subjects only if both career and cycle are selected
    if (selectedCarreraId && selectedCiclo) {
      this.isLoadingAsignaturas = true;
      this.asignaturaService.obtenerPorCarreraYCiclo(selectedCiclo, selectedCarreraId)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.snackBar.open(`Error loading subjects: ${error.message || 'Unknown error'}`, 'Close', { duration: 5000 });
            this.isLoadingAsignaturas = false;
            return throwError(() => new Error(error.message || 'Unknown error loading subjects.'));
          })
        )
        .subscribe(
          (data: Asignatura[]) => {
            console.log('Asignaturas recibidas del backend:', data); // DEBUGGING: Check data structure
            this.asignaturas = data;
            this.isLoadingAsignaturas = false;
            if (this.asignaturas.length === 0) {
              this.snackBar.open('No subjects found for the selected career and cycle.', 'Close', { duration: 3000 });
            }
          }
        );
    }
  }

  onSubmit(): void {
    if (this.foroForm.valid) { // No longer checking profesorCarreraId
      const newGrupoForo: GrupoForo = {
        Titulo: this.foroForm.value.Titulo,
        Descripcion: this.foroForm.value.Descripcion,
        Campo: this.foroForm.value.Campo,
        FechaCreacion: new Date(),
        id_Asigneatura: this.foroForm.value.selectedAsignaturaId,
        Estado: true
      };

      this.grupoForoService.createGrupoForo(newGrupoForo).subscribe({
        next: (response: GrupoForo) => {
          this.snackBar.open(`Forum group "${response.Titulo}" created successfully!`, 'Close', { duration: 3000 });
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creating forum group:', err);
          let errorMessage = 'Error creating forum group.';
          if (err.message && err.message.includes('duplicate key')) { // Adjusted message for backend error
             errorMessage = 'A forum group already exists for this subject.';
          } else {
             errorMessage = err.message || 'Unknown error.';
          }
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    } else {
      this.foroForm.markAllAsTouched();
      this.snackBar.open('Please complete all required fields and correct errors.', 'Close', { duration: 4000 });
    }
  }

  resetForm(): void {
    this.foroForm.reset({
      selectedCarreraId: null, // Reset career selection
      selectedCiclo: null,
      selectedAsignaturaId: null,
      Titulo: '',
      Descripcion: '',
      Campo: ''
    });
    this.asignaturas = [];
  }

  get fc() {
    return this.foroForm.controls;
  }
}
