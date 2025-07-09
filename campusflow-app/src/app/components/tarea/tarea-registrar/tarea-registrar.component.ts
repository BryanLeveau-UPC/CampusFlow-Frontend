import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  standalone: true,
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
      titulo: ['', [Validators.required, Validators.minLength(6)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fechaLimite: [null, [Validators.required, this.fechaNoPasadaValidator]],
      prioridad: ['Media', Validators.required],
      id_horario: [null, this.horarioOpcionalValidator]
    });
  }

  ngOnInit(): void {
    const idUsuario = this.authService.getUserId();
    if (!idUsuario) {
      this.snackBar.open('No se pudo obtener el ID del usuario. Inicie sesión.', 'Cerrar', { duration: 5000 });
      this.router.navigate(['/login']);
      return;
    }

    this.estudianteService.getEstudianteByUserId(idUsuario).subscribe({
      next: (estudiante) => {
        this.idEstudiante = estudiante?.idEstudiante ?? null;
      },
      error: () => {
        this.snackBar.open('No se pudo obtener el estudiante vinculado al usuario.', 'Cerrar', { duration: 5000 });
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Validador personalizado para que la fecha no sea anterior a hoy.
   */
  fechaNoPasadaValidator(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (!valor) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const seleccionada = new Date(valor);
    seleccionada.setHours(0, 0, 0, 0);

    return seleccionada < hoy ? { fechaPasada: true } : null;
  }

  /**
   * Validador opcional para id_horario: si se ingresa, debe ser > 0.
   */
  horarioOpcionalValidator(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (valor === null || valor === undefined || valor === '') return null;
    return valor > 0 ? null : { horarioInvalido: true };
  }

  onSubmit(): void {
    if (this.tareaForm.valid && this.idEstudiante) {
      this.loading = true;
      const nuevaTarea: Tarea = {
        ...this.tareaForm.value,
        id_estudiante: this.idEstudiante,
        estado: true,
        fechaLimite: this.tareaForm.value.fechaLimite.toISOString().split('T')[0]
      };

      if ( nuevaTarea.id_horario === '') {
        nuevaTarea.id_horario = null as any;
      }

      this.tareaService.createTarea(nuevaTarea).subscribe({
        next: () => {
          this.snackBar.open('Tarea registrada exitosamente!', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.router.navigate(['/dashboard-estudiante/tareas']);
        },
        error: (err) => {
          const msg = `Error al registrar tarea: ${err.message}`;
          console.error(msg, err);
          this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
          this.loading = false;
        }
      });
    } else {
      this.snackBar.open('Complete todos los campos correctamente.', 'Cerrar', { duration: 3000 });
      this.tareaForm.markAllAsTouched();
    }
  }

  goBackToList(): void {
    this.router.navigate(['/dashboard-estudiante/tareas']);
  }
}
