import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Tarea } from '../../../model/tarea';
import { AuthService } from '../../../services/auth.service';
import { TareaService } from '../../../services/tarea.service';
import { EstudianteService } from '../../../services/estudiante.service';

@Component({
  selector: 'app-tarea-registrar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './tarea-registrar.component.html',
  styleUrl: './tarea-registrar.component.css',
})
export class TareaRegistrarComponent implements OnInit {
  tareaForm: FormGroup;
  prioridades: string[] = ['Baja', 'Media', 'Alta'];
  idEstudiante: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tareaService: TareaService,
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.tareaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaLimite: [null, Validators.required],
      prioridad: ['Media', Validators.required], // Valor por defecto
      // id_horario: [null, Validators.required] // Asumo que id_horario es requerido y se ingresa manualmente por ahora
      // Si id_horario es opcional o se obtiene de otra forma, ajusta esto.
      // Para simplificar, lo haré opcional por ahora si no hay una lista de horarios.
      id_horario: [null] // Puede ser null si no es obligatorio al crear
    });
  }

ngOnInit(): void {
  const idUsuario = this.authService.getUserId(); // Este es el ID del usuario
  if (!idUsuario) {
    this.snackBar.open('No se pudo obtener el ID del usuario. Inicie sesión.', 'Cerrar', { duration: 5000 });
    this.router.navigate(['/login']);
    return;
  }

  // Aquí haces la llamada para obtener el ID del estudiante asociado
  this.estudianteService.getEstudianteByUserId(idUsuario).subscribe({
    next: (estudiante) => {
      this.idEstudiante = estudiante.idEstudiante !== undefined ? estudiante.idEstudiante : null;
    },
    error: () => {
      this.snackBar.open('No se pudo obtener el estudiante vinculado al usuario.', 'Cerrar', { duration: 5000 });
      this.router.navigate(['/login']);
    }
  });
}

  /**
   * Maneja el envío del formulario para registrar una nueva tarea.
   */
  onSubmit(): void {
    if (this.tareaForm.valid && this.idEstudiante) {
      this.loading = true;
      const nuevaTarea: Tarea = {
        ...this.tareaForm.value,
        id_estudiante: this.idEstudiante,
        estado: true, // Por defecto, una nueva tarea está activa
        fechaLimite: this.tareaForm.value.fechaLimite.toISOString().split('T')[0] // Formato YYYY-MM-DD para LocalDate en Java
      };

      // Si id_horario es opcional y no se ingresa, asegúrate de que sea null o undefined
      if (nuevaTarea.id_horario === 0.0) {
        nuevaTarea.id_horario = null as any; // Castear a null para backend si es un string vacío
      }

      this.tareaService.createTarea(nuevaTarea).subscribe({
        next: (response) => {
          this.snackBar.open('Tarea registrada exitosamente!', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.router.navigate(['/dashboard-estudiante/tareas']); // Redirigir a la lista de tareas
        },
        error: (err) => {
          const msg = `Error al registrar tarea: ${err.message}`;
          console.error(msg, err);
          this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
          this.loading = false;
        }
      });
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      this.tareaForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores
    }
  }

  /**
   * Navega de vuelta a la lista de tareas.
   */
  goBackToList(): void {
    this.router.navigate(['/dashboard-estudiante/tareas']);
  }
}