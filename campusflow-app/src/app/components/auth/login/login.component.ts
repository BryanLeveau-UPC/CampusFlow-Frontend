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

import { AuthService } from '../../../services/auth.service'; 
import { AuthRequest } from '../../../model/Auth';

@Component({
  selector: 'app-login',
  standalone: true, // Assuming this is a standalone component
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit { // Implement OnInit for consistency
  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    // private usuarioService: UsuarioService, // You might not need this for login directly
    private authService: AuthService, // <--- INJECT AUTHSERVICE
    private snackBar: MatSnackBar,
    private ruta: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6)]] 
    });
  }

  acceder(): void { 
    if (this.formulario.invalid) {
      this.snackBar.open('Por favor, completa todos los campos correctamente.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const request: AuthRequest = { 
      username: this.formulario.value.username,
      password: this.formulario.value.password,
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        this.snackBar.open('¡Bienvenido!', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error('Login component error:', err);
      }
    });
  }
}