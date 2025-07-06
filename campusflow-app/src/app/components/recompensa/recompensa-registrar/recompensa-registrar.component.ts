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
export class RecompensaRegistrarComponent implements OnInit {
  recompensaForm: FormGroup;
  idEstudianteEstadistica: number | null = null; // To store id_EstudianteEstadistica
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private recompensaService: RecompensaService, // Inject your RecompensaService
    private authService: AuthService, // To get the user ID
    private estudianteService: EstudianteService, // To get the associated student's ID
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.recompensaForm = this.fb.group({
      Plataforma: ['', Validators.required],
      URL: ['', [Validators.required, Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$')]], // Basic URL validation
    });
  }

  ngOnInit(): void {
    // Get the logged-in user's ID
    const idUsuario = this.authService.getUserId();
    if (!idUsuario) {
      this.snackBar.open('No se pudo obtener el ID del usuario. Inicie sesión.', 'Cerrar', { duration: 5000 });
      this.router.navigate(['/login']);
      return;
    }

    // Use EstudianteService to get id_EstudianteEstadistica
    // NOTE: I'm assuming `getEstudianteByUserId` returns an object containing `id_EstudianteEstadistica`.
    // If your data structure is different, adjust this part.
    this.estudianteService.getEstudianteByUserId(idUsuario).subscribe({
      next: (estudiante) => {
        // Here you should assign the correct ID from the student's statistics.
        // I'm assuming your `estudiante` object has an `id_EstudianteEstadistica` property.
        // If not, you'll need a service or method that provides this specific ID.
        this.idEstudianteEstadistica = null;

        if (this.idEstudianteEstadistica === null) {
          this.snackBar.open('No se pudo obtener el ID de estadística del estudiante. Asegúrese de que el estudiante tenga una estadística asociada.', 'Cerrar', { duration: 5000 });
          // Optionally, you could navigate to an error or configuration page
        }
      },
      error: (err) => {
        console.error('Error al obtener el estudiante por ID de usuario:', err);
        this.snackBar.open('Error al obtener los datos del estudiante.', 'Cerrar', { duration: 5000 });
        this.router.navigate(['/dashboard-estudiante']); // Or an error page
      }
    });
  }

  /**
   * Handles the form submission to register a new reward.
   */
  onSubmit(): void {
    if (this.recompensaForm.valid && this.idEstudianteEstadistica !== null) {
      this.loading = true;
      const nuevaRecompensa: Recompensa = {
        ...this.recompensaForm.value,
        id_EstudianteEstadistica: this.idEstudianteEstadistica,
        Estado: true, // By default, a new reward is active
      };

      // Call the 'registrar' method from your RecompensaService
      this.recompensaService.registrar(nuevaRecompensa).subscribe({
        next: (response) => {
          this.snackBar.open('Recompensa registrada exitosamente!', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.router.navigate(['/dashboard-estudiante/recompensas']); // Redirect to the rewards list
        },
        error: (err) => {
          const msg = `Error al registrar recompensa: ${err.message || 'Error desconocido'}`;
          console.error(msg, err);
          this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
          this.loading = false;
        }
      });
    } else {
      let errorMessage = 'Por favor, complete todos los campos requeridos.';
      if (this.idEstudianteEstadistica === null) {
        errorMessage = 'No se pudo vincular la recompensa a un estudiante. Asegúrese de que su perfil de estudiante esté completo.';
      }
      this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
      this.recompensaForm.markAllAsTouched(); // Mark all fields as touched to show errors
    }
  }

  /**
   * Navigates back to the rewards list.
   */
  goBackToList(): void {
    this.router.navigate(['/dashboard-estudiante/recompensas']);
  }
}