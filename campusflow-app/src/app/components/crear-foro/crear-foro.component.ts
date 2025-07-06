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

  // Ya no necesitamos la lista de carreras, solo el ID de la carrera del profesor
  profesorCarreraId: number | null = null; // ID de la carrera del profesor logueado
  // isLoadingCarreras: boolean = false; // Ya no es necesario

  ciclos: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  asignaturas: Asignatura[] = [];

  isLoadingAsignaturas: boolean = false;

  constructor(
    private fb: FormBuilder,
    private asignaturaService: AsignaturaService,
    private grupoForoService: GrupoForoService,
    // private carreraService: CarreraService, // Ya no inyectamos CarreraService
    private authService: AuthService, // <-- Inyectar AuthService
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadProfesorCarreraAndAsignaturas(); // <-- Nueva función para cargar carrera del profesor y asignaturas

    // Solo necesitamos escuchar los cambios del ciclo, ya que la carrera del profesor es fija
    this.foroForm.get('selectedCiclo')?.valueChanges.subscribe(() => this.onCicloChange());
  }

  private initForm(): void {
    this.foroForm = this.fb.group({
      // selectedCarreraId: [null, Validators.required], // Ya no es necesario este control
      selectedCiclo: [null, Validators.required],
      selectedAsignaturaId: [null, Validators.required],
      Titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      Descripcion: ['', [Validators.required, Validators.minLength(10)]],
      Campo: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  /**
   * Obtiene el ID de la carrera del profesor y luego carga las asignaturas.
   */
  private loadProfesorCarreraAndAsignaturas(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      // Simulación: En una aplicación real, obtendrías el ID de la carrera
      // del profesor desde su perfil de usuario o un servicio de profesor.
      // Aquí, asumiré un ID de carrera fijo para demostración.
      // **DEBES REEMPLAZAR ESTO CON LA LÓGICA REAL PARA OBTENER EL idCarrera DEL PROFESOR**
      this.authService.getUserDetails(userId).subscribe({
        next: (usuario) => {
          // Si el objeto 'usuario' tuviera un campo 'idCarrera':
          // this.profesorCarreraId = usuario.idCarrera;

          // ******************************************************************
          // TEMPORAL: Asumo un idCarrera para el profesor para que el código funcione.
          // Reemplaza '1' con el idCarrera real del profesor logueado.
          // Este 'idCarrera' debería venir de la información del perfil del profesor.
          this.profesorCarreraId = 1; // EJEMPLO: Profesor asociado a Ingeniería de Sistemas
          // ******************************************************************

          if (!this.profesorCarreraId) {
            this.snackBar.open('No se pudo obtener la carrera del profesor. Contacte soporte.', 'Cerrar', { duration: 5000 });
            return;
          }
          // Una vez que tenemos el profesorCarreraId, podemos cargar asignaturas
          // si el ciclo ya está seleccionado (por ejemplo, si el usuario vuelve al formulario)
          this.onCicloChange();
        },
        error: (err) => {
          this.snackBar.open(`Error al obtener perfil del profesor: ${err.message || 'Error desconocido'}`, 'Cerrar', { duration: 5000 });
          console.error('Error al obtener detalles del profesor:', err);
        }
      });

    } else {
      this.snackBar.open('ID de usuario no encontrado. Por favor, inicie sesión.', 'Cerrar', { duration: 5000 });
    }
  }

  // Lógica para cargar asignaturas cuando cambia solo el ciclo
  onCicloChange(): void {
    const selectedCiclo = this.foroForm.get('selectedCiclo')?.value;

    this.asignaturas = []; // Limpiar asignaturas anteriores
    this.foroForm.get('selectedAsignaturaId')?.patchValue(null); // Limpiar selección de asignatura

    // Solo cargamos asignaturas si tenemos la carrera del profesor Y un ciclo seleccionado
    if (this.profesorCarreraId && selectedCiclo) {
      this.isLoadingAsignaturas = true;
      this.asignaturaService.obtenerPorCarreraYCiclo(selectedCiclo, this.profesorCarreraId)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.snackBar.open(`Error al cargar asignaturas: ${error.message || 'Error desconocido'}`, 'Cerrar', { duration: 5000 });
            this.isLoadingAsignaturas = false;
            return throwError(() => new Error(error.message || 'Error desconocido al cargar asignaturas.'));
          })
        )
        .subscribe(
          (data: Asignatura[]) => {
            this.asignaturas = data;
            this.isLoadingAsignaturas = false;
            if (this.asignaturas.length === 0) {
              this.snackBar.open('No se encontraron asignaturas para este ciclo en su carrera.', 'Cerrar', { duration: 3000 });
            }
          }
        );
    }
  }

  onSubmit(): void {
    if (this.foroForm.valid && this.profesorCarreraId) { // Asegurarse de que tenemos el idCarrera del profesor
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
          this.snackBar.open(`Grupo de foro "${response.Titulo}" creado exitosamente!`, 'Cerrar', { duration: 3000 });
          this.resetForm();
        },
        error: (err) => {
          console.error('Error al crear grupo de foro:', err);
          let errorMessage = 'Error al crear grupo de foro.';
          if (err.message && err.message.includes('llave duplicada')) {
             errorMessage = 'Ya existe un grupo de foro para esta asignatura.';
          } else {
             errorMessage = err.message || 'Error desconocido.';
          }
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      this.foroForm.markAllAsTouched();
      this.snackBar.open('Por favor, completa todos los campos requeridos y corrige los errores.', 'Cerrar', { duration: 4000 });
    }
  }

  resetForm(): void {
    this.foroForm.reset({
      // selectedCarreraId: null, // Ya no es necesario resetear este
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