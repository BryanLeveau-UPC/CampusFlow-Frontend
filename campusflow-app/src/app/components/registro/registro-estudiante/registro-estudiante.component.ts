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
import { Carrera } from '../../../model/carrera'; // Asegúrate de que este path sea correcto
import { CarreraService } from '../../../services/carrera.service'; // Asegúrate de que este path sea correcto
import { RegisterEstudiantePayload } from '../../../model/RegisterEstudiantePayload'; // Asegúrate de que este path sea correcto
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de importar HttpClientModule

@Component({
  selector: 'app-registro-estudiante',
  standalone: true, // Añadir 'standalone: true' si este componente es standalone
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
    HttpClientModule, // Es importante para que los servicios HTTP funcionen en standalone
  ],
  templateUrl: './registro-estudiante.component.html',
  styleUrl: './registro-estudiante.component.css',
})
export class RegistroEstudianteComponent implements OnInit { // Implementar OnInit
  formulario!: FormGroup;
  id?: number;
  carreras: Carrera[] = [];

  constructor(
    private fb: FormBuilder,
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
        ciclo: [
          null,
          [
            Validators.required,
            Validators.min(1),
            Validators.max(12),
          ],
        ],
        idCarrera: [null, [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
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
