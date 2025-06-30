import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Carrera } from '../../../model/carrera'; 
import { CarreraService } from '../../../services/carrera.service'; 
import { RegisterEstudiantePayload } from '../../../model/RegisterEstudiantePayload'; 
import { HttpClientModule } from '@angular/common/http'; 
import { ProfesorService } from '../../../services/profesor.service';
import { RegisterProfesorPayload } from '../../../model/RegisterProfesorPayload';

@Component({
  selector: 'app-registro-profesor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
    MatIconModule,
    HttpClientModule,
  ],
  templateUrl: './registro-profesor.component.html',
  styleUrl: './registro-profesor.component.css'
})
export class RegistroProfesorComponent implements OnInit {
  formulario!: FormGroup;
  carreras: Carrera[] = [];

  constructor(
    private fb: FormBuilder,
    private carreraService: CarreraService,
    private profesorService: ProfesorService, // Inyecta el nuevo servicio
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.formulario = this.fb.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z\s]+$/),
          ],
        ],
        apellido: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z\s]+$/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9_]+$/),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        especialidad: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        ],
        numColegiatura: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9]+$/),
          ],
        ],
        idCarrera: [null, [Validators.required]], // Asumiendo que idCarrera es obligatorio
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit() {
    this.cargarCarreras();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  cargarCarreras(): void {
    this.carreraService.getAllCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
        console.log('Carreras cargadas exitosamente:', this.carreras); // <-- Añadir este log para depurar
        if (this.carreras.length === 0) {
            console.warn('La lista de carreras está vacía. Asegúrate de que el backend esté devolviendo datos.');
        } else {
            console.log('Primera carrera en la lista:', this.carreras[0]); // <-- Log para ver la estructura de un objeto Carrera
        }
      },
      error: (err) => {
        console.error('Error al cargar carreras:', err);
        this.snackBar.open(
          'Error al cargar las carreras. Inténtelo de nuevo más tarde.',
          'Cerrar',
          { duration: 3000 }
        );
      },
    });
  }

  registrar(): void {
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      this.snackBar.open(
        'Por favor, complete todos los campos requeridos correctamente.',
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }

    if (this.formulario.errors?.['passwordMismatch']) {
      this.snackBar.open('Las contraseñas no coinciden.', 'Cerrar', {
        duration: 4000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const payload: RegisterProfesorPayload = {
      nombre: this.formulario.value.nombre,
      apellido: this.formulario.value.apellido,
      email: this.formulario.value.email,
      username: this.formulario.value.username,
      password: this.formulario.value.password,
      especialidad: this.formulario.value.especialidad,
      numColegiatura: this.formulario.value.numColegiatura,
      idCarrera: this.formulario.value.idCarrera,
    };

    console.log('Iniciando registro de profesor con payload:', payload);

    this.profesorService.registerProfesor(payload).subscribe({
      next: (response) => {
        console.log('Registro de profesor exitoso:', response);
        this.snackBar.open('¡Registro de profesor exitoso!', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/login']); // Redirige al usuario a la página de login
      },
      error: (err) => {
        console.error('Error en el registro de profesor:', err);
        this.snackBar.open(err.message || 'Error en el registro. Inténtelo de nuevo.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
