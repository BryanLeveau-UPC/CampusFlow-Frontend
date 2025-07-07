import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Tarea } from '../../../model/tarea';
import { AuthService } from '../../../services/auth.service';
import { TareaService } from '../../../services/tarea.service';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-tarea-listar',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSpinner
  ],
  templateUrl: './tarea-listar.component.html',
  styleUrl: './tarea-listar.component.css'
})

export class TareaListarComponent implements OnInit {
  tareas: Tarea[] = [];
  idEstudiante: number | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private tareaService: TareaService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.idEstudiante = this.authService.getUserId(); // Obtener el ID del estudiante logueado
    if (this.idEstudiante) {
      this.loadTareas(this.idEstudiante);
    } else {
      this.errorMessage = 'No se pudo obtener el ID del estudiante. Por favor, inicie sesión.';
      this.loading = false;
      this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
      // Opcional: Redirigir al login si no hay ID de usuario
      // this.router.navigate(['/login']);
    }
  }

  /**
   * Carga las tareas activas para el estudiante.
   * @param idEstudiante El ID del estudiante.
   */
  loadTareas(idEstudiante: number): void {
    this.loading = true;
    this.errorMessage = null;
    this.tareaService.getTareasActivasPorEstudiante(idEstudiante).subscribe({
      next: (data) => {
        this.tareas = data;
        this.loading = false;
        console.log('Tareas cargadas:', this.tareas);
      },
      error: (err) => {
        this.errorMessage = `Error al cargar las tareas: ${err.message}`;
        this.loading = false;
        console.error('Error al cargar tareas:', err);
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  /**
   * Navega al formulario de registro de tareas.
   */
  goToRegisterTarea(): void {
    this.router.navigate(['tarea/registrar']);
  }

  /**
   * Marca una tarea como completada (lógicamente la elimina).
   * @param tarea La tarea a marcar como completada.
   */
  markAsCompleted(tarea: Tarea): void {
    if (tarea.idTarea) {
      this.tareaService.deleteTarea(tarea.idTarea).subscribe({
        next: () => {
          this.snackBar.open('Tarea marcada como completada.', 'Cerrar', { duration: 3000 });
          // Recargar la lista de tareas para reflejar el cambio
          if (this.idEstudiante) {
            this.loadTareas(this.idEstudiante);
          }
        },
        error: (err) => {
          const msg = `Error al marcar tarea como completada: ${err.message}`;
          console.error(msg, err);
          this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  /**
   * Formatea la fecha para una mejor visualización.
   * @param date La fecha a formatear.
   * @returns La fecha formateada.
   */
  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}