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
import { Estudiante } from '../../../model/estudiante';
import { EstudianteService } from '../../../services/estudiante.service';

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
    private estudianteService: EstudianteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initCargaTareas();
  }

  initCargaTareas(): void {
    const userId = this.authService.getUserId();
    console.log('User ID:', userId);

    if (!userId) {
      this.errorMessage = 'No se pudo obtener el ID del usuario. Por favor, inicie sesión.';
      this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
      this.loading = false;
      return;
    }

    this.estudianteService.getEstudianteByUserId(userId).subscribe({
      next: (estudiante: Estudiante) => {
        if (estudiante && estudiante.idEstudiante) {
          this.idEstudiante = estudiante.idEstudiante;
          console.log('ID Estudiante encontrado:', this.idEstudiante);
          this.loadTareas(this.idEstudiante);
        } else {
          this.errorMessage = 'No se encontró el estudiante asociado al usuario.';
          this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
          this.loading = false;
        }
      },
      error: (err) => {
        this.errorMessage = `Error al obtener el estudiante: ${err.message || 'Error desconocido'}`;
        console.error('Error EstudianteService:', err);
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

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

  goToRegisterTarea(): void {
    this.router.navigate(['tarea/registrar']);
  }

  markAsCompleted(tarea: Tarea): void {
    if (tarea.idTarea) {
      this.tareaService.deleteTarea(tarea.idTarea).subscribe({
        next: () => {
          this.snackBar.open('Tarea marcada como completada.', 'Cerrar', { duration: 3000 });
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

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}