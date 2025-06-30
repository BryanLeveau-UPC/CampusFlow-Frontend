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

@Component({
  selector: 'app-registro-estudiante',
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
  ],
  templateUrl: './registro-estudiante.component.html',
  styleUrl: './registro-estudiante.component.css',
})
export class RegistroEstudianteComponent {
  formulario!: FormGroup;
  id?: number;
  carreras: Carrera[] = [];

  constructor(
    private fb: FormBuilder,
    //private puestoService: PuestoService,
    private carreraService: CarreraService,
    private snackBar: MatSnackBar,
    private ruta: ActivatedRoute,
    private router: Router
  ) {
    this.formulario = this.fb.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.minLength(2), // Ajustado a 2, tu ejemplo decía 4-20
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z\s]+$/), // Solo letras y espacios
          ],
        ],
        apellido: [
          '',
          [
            Validators.required,
            Validators.minLength(2), // Ajustado a 2
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z\s]+$/), // Solo letras y espacios
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9_]+$/), // Solo letras, números y guion bajo
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
            ), // Al menos 6 chars, 1 mayúscula, 1 minúscula, 1 número, 1 caracter especial
          ],
        ],
        confirmPassword: ['', [Validators.required]], // Campo para confirmar contraseña
        ciclo: [
          null, // Usar null para valores numéricos vacíos inicialmente
          [
            Validators.required,
            Validators.min(1),
            Validators.max(12), // Asumiendo un máximo de 12 ciclos
          ],
        ],
        idCarrera: [null, [Validators.required]], // Usar null para select vacío inicialmente
      },
      {
        validators: this.passwordMatchValidator, // Aplicar el validador personalizado a todo el FormGroup
      }
    );
  }

  ngOnInit() {
    this.id = +this.ruta.snapshot.paramMap.get('id')!;
    if (this.id) {
      console.log('Modo edición detectado para ID:', this.id);
      this.snackBar.open(
        'Este formulario es de REGISTRO, no de edición.',
        'Info',
        { duration: 5000 }
      );
    }
    this.cargarCarreras();
  }
  
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    // Si ambos campos existen y tienen valores
    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      // Retorna un error si no coinciden
      return { passwordMismatch: true };
    }
    // Retorna null (sin errores) si los campos no existen, no tienen valores, o si coinciden
    return null;
  }

  cargarCarreras(): void {
    this.carreraService.getAllCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
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
    const payload: RegisterEstudiantePayload = {
      nombre: this.formulario.value.nombre,
      apellido: this.formulario.value.apellido,
      email: this.formulario.value.email,
      username: this.formulario.value.username,
      password: this.formulario.value.password,
      ciclo: this.formulario.value.ciclo,
      idCarrera: this.formulario.value.idCarrera,
    };

    console.log('Iniciando registro con payload:', payload);
  }
}
