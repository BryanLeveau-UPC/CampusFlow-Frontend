import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Recompensa } from '../../../model/recompensa';
import { AuthService } from '../../../services/auth.service';
import { EstudianteService } from '../../../services/estudiante.service';
import { RecompensaService } from '../../../services/recompensa.service';
import { EstudianteEstadistica } from '../../../model/estudianteEstadistica';
import { Estudiante } from '../../../model/estudiante';

@Component({
  selector: 'app-recompensa-registrar',
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
  ],
  templateUrl: './recompensa-registrar.component.html',
  styleUrl: './recompensa-registrar.component.css'
})

export class RecompensaRegistrarComponent { // Removed OnInit implementation
  recompensaForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private recompensaService: RecompensaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.recompensaForm = this.fb.group({
      Plataforma: ['', Validators.required],
      URL: ['', [Validators.required, Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$')]],
      // Removed 'estudianteId' form control as it's not being selected
    });
  }

  // ngOnInit is no longer needed since we're not fetching student data
  // ngOnInit(): void { }

  /**
   * Handles the form submission to register a new reward.
   */
  onSubmit(): void {
    // Only check form validity, as id_EstudianteEstadistica will be null
    if (this.recompensaForm.valid) {
      this.loading = true;
      const nuevaRecompensa: Recompensa = {
        Plataforma: this.recompensaForm.value.Plataforma,
        URL: this.recompensaForm.value.URL,
        id_EstudianteEstadistica: 1 , // Explicitly set to null
        Estado: true, // By default, a new reward is active
      };

      this.recompensaService.registrar(nuevaRecompensa).subscribe({
        next: (response) => {
          this.snackBar.open('Recompensa registrada exitosamente!', 'Cerrar', { duration: 3000 });
          this.loading = false;
          // Redirect to a professor's dashboard or rewards list
          this.router.navigate(['/listar-recompensa']);
        },
        error: (err) => {
          const msg = `Error al registrar recompensa: ${err.message || 'Error desconocido'}`;
          console.error(msg, err);
          this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
          this.loading = false;
        }
      });
    } else {
      const errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      this.recompensaForm.markAllAsTouched(); // Mark all fields as touched to show errors
    }
  }

  /**
   * Navigates back to the rewards list (for professors).
   */
  goBackToList(): void {
    this.router.navigate(['/dashboard-profesor/recompensas']); // Adjust path for professor's dashboard
  }
}