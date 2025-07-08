import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Asignatura } from '../../model/asignatura';
import { Carrera } from '../../model/carrera';
import { Estudiante } from '../../model/estudiante';
import { Nota } from '../../model/nota';
import { AsignaturaService } from '../../services/asignatura.service';
import { AuthService } from '../../services/auth.service';
import { CarreraService } from '../../services/carrera.service';
import { EstudianteService } from '../../services/estudiante.service';
import { NotaService } from '../../services/nota.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ErrorDashboardComponent } from "../dashboard/dasboard-error/dasboard-error.component";

@Component({
  selector: 'app-registrar-notas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
    ErrorDashboardComponent
],
  templateUrl: './registrar-notas.component.html',
  styleUrl: './registrar-notas.component.css',
})
export class RegistrarNotasComponent implements OnInit {
  notaForm: FormGroup;
  estudiantes: Estudiante[] = [];
  asignaturas: Asignatura[] = [];
  asignaturasFiltradas: Asignatura[] = [];
  carreras: Carrera[] = [];
  selectedCarreraId: number | null = null;
  selectedEstudiante: Estudiante | null = null;
  profesorCarreraId: number | null = null;

  tiposNota: string[] = ['Examen', 'Tarea', 'Participación', 'Proyecto', 'Laboratorio', 'Exposición'];

  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
    private notaService: NotaService,
    private asignaturaService: AsignaturaService,
    private carreraService: CarreraService,
    private authService: AuthService
  ) {
    this.notaForm = this.fb.group({
      id_estudiante: [null, Validators.required],
      id_asignatura: [null, Validators.required],
      nombreAsignatura: [''],
      Tipo: ['', Validators.required],
      Puntaje: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      Peso_Nota: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      Estado: [true]
    });
  }

  ngOnInit(): void {
    this.loadCarreras();
    this.loadProfesorCareer();
    this.loadAllAsignaturas();

    this.notaForm.get('id_estudiante')?.valueChanges.subscribe(idEstudiante => {
      // FIX: Use 'IdEstudiante' as per the Estudiante interface
      this.selectedEstudiante = this.estudiantes.find(e => e.idEstudiante === idEstudiante) || null;
      if (this.selectedEstudiante && this.selectedEstudiante.idCarrera) {
        this.filterAsignaturasByCarrera(this.selectedEstudiante.idCarrera);
        if (this.selectedCarreraId !== this.selectedEstudiante.idCarrera) {
          this.selectedCarreraId = this.selectedEstudiante.idCarrera;
        }
      } else {
        this.asignaturasFiltradas = [];
      }
      this.notaForm.patchValue({ id_asignatura: null, nombreAsignatura: '' });
    });

    this.notaForm.get('id_asignatura')?.valueChanges.subscribe(idAsignatura => {
      const selectedAsignatura = this.asignaturasFiltradas.find(a => a.idAsignatura === idAsignatura);
      if (selectedAsignatura) {
        this.notaForm.patchValue({ nombreAsignatura: selectedAsignatura.Nombre });
      } else {
        this.notaForm.patchValue({ nombreAsignatura: '' });
      }
    });
  }

  loadProfesorCareer(): void {
    this.authService.getProfesorCarreraId().subscribe(
      (idCarrera: number | null) => {
        this.profesorCarreraId = idCarrera;
        if (this.profesorCarreraId) {
          this.selectedCarreraId = this.profesorCarreraId;
          this.loadEstudiantesByCarrera(this.profesorCarreraId);
          this.filterAsignaturasByCarrera(this.profesorCarreraId);
        } else {
          this.loadAllEstudiantes();
        }
      },
      error => {
        console.error('Error al obtener el ID de carrera del profesor:', error);
        this.errorMessage = 'No se pudo obtener la carrera asociada al profesor. Mostrando todos los estudiantes.';
        this.loadAllEstudiantes();
      }
    );
  }

  loadCarreras(): void {
    this.carreraService.listar().subscribe(
      (data: Carrera[]) => {
        this.carreras = data;
      },
      error => {
        console.error('Error al cargar carreras:', error);
        this.errorMessage = 'Error al cargar las carreras disponibles.';
      }
    );
  }

  onCarreraSelected(): void {
    this.notaForm.patchValue({ id_estudiante: null });
    this.selectedEstudiante = null;
    this.notaForm.patchValue({ id_asignatura: null, nombreAsignatura: '' });
    this.asignaturasFiltradas = [];

    if (this.selectedCarreraId) {
      this.loadEstudiantesByCarrera(this.selectedCarreraId);
      this.filterAsignaturasByCarrera(this.selectedCarreraId);
    } else {
      this.estudiantes = [];
    }
  }

  loadEstudiantesByCarrera(carreraId: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.estudianteService.listar().subscribe(
      (data: Estudiante[]) => {
        this.estudiantes = data.filter(e => e.idCarrera === carreraId);
        this.isLoading = false;
        if (this.estudiantes.length === 0) {
          this.errorMessage = 'No hay estudiantes registrados para la carrera seleccionada.';
        }
      },
      error => {
        console.error('Error al cargar estudiantes por carrera:', error);
        this.errorMessage = 'Error al cargar los estudiantes de esta carrera.';
        this.isLoading = false;
      }
    );
  }

  loadAllEstudiantes(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.estudianteService.listar().subscribe(
      (data: Estudiante[]) => {
        this.estudiantes = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar todos los estudiantes:', error);
        this.errorMessage = 'Error al cargar todos los estudiantes.';
        this.isLoading = false;
      }
    );
  }

  loadAllAsignaturas(): void {
    this.asignaturaService.listar().subscribe(
      (data: Asignatura[]) => {
        this.asignaturas = data;
        if (this.profesorCarreraId) {
          this.filterAsignaturasByCarrera(this.profesorCarreraId);
        } else {
          this.asignaturasFiltradas = data;
        }
      },
      error => {
        console.error('Error al cargar asignaturas:', error);
        this.errorMessage = 'Error al cargar las asignaturas disponibles.';
      }
    );
  }

  filterAsignaturasByCarrera(carreraId: number): void {
    this.asignaturasFiltradas = this.asignaturas.filter(asig => asig.id_carrera === carreraId);
  }

  guardarNota(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.notaForm.invalid) {
      this.notaForm.markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
      return;
    }

    const notaToSave: Nota = {
      ...this.notaForm.value,
      id_estudiante: this.notaForm.get('id_estudiante')?.value,
      id_asignatura: this.notaForm.get('id_asignatura')?.value,
      nombreAsignatura: this.notaForm.get('nombreAsignatura')?.value,
      Estado: true
    };

    this.isLoading = true;
    this.notaService.guardarNota(notaToSave).subscribe(
      (response: Nota) => {
        this.successMessage = `Nota de ${response.puntaje} guardada exitosamente!`;
        this.resetForm();
        this.isLoading = false;
      },
      error => {
        console.error('Error al guardar la nota:', error);
        this.errorMessage = 'Error al guardar la nota: ' + (error.message || 'Error desconocido.');
        this.isLoading = false;
      }
    );
  }

  resetForm(): void {
    this.notaForm.reset({
      id_estudiante: this.selectedEstudiante?.idEstudiante || null, // Keep student selected or reset
      id_asignatura: null,
      nombreAsignatura: '',
      Tipo: '',
      Puntaje: '',
      Peso_Nota: '',
      Estado: true
    });
    this.notaForm.get('id_estudiante')?.markAsUntouched();
    this.notaForm.get('id_asignatura')?.markAsUntouched();
  }
}