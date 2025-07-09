import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Nota } from '../../model/nota';
import { Estudiante } from '../../model/estudiante';
import { AuthService } from '../../services/auth.service';
import { EstudianteService } from '../../services/estudiante.service';
import { NotaService } from '../../services/nota.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardNavbarComponent } from "../dashboard/dashboard-navbar/dashboard-navbar.component";

@Component({
  selector: 'app-notas-asignatura',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DashboardNavbarComponent
],
  templateUrl: './notas-asignatura.component.html',
  styleUrl: './notas-asignatura.component.css'
})
export class NotasAsignaturaComponent implements OnInit {
  // Cambiado para contener todas las notas en una lista plana
  allNotas: Nota[] = [];
  isLoading: boolean = true;
  // Columnas para la tabla única, incluyendo 'nombreAsignatura'
  displayedColumns: string[] = ['nombreAsignatura', 'tipo', 'puntaje', 'peso'];

  constructor(
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private notaService: NotaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadNotas();
  }

  loadNotas(): void {
    this.isLoading = true;
    const userId = this.authService.getUserId();
    console.log('User ID obtenido:', userId);

    if (!userId) {
      this.snackBar.open('Error: ID de usuario no encontrado. Por favor, inicie sesión nuevamente.', 'Cerrar', { duration: 5000 });
      this.isLoading = false;
      return;
    }
    console.log('Iniciando carga de notas para el usuario con ID:', userId);
    this.estudianteService.getEstudianteByUserId(userId).subscribe({
      next: (estudiante: Estudiante) => {
        if (estudiante && estudiante.idEstudiante) {
          console.log('Estudiante ID encontrado:', estudiante.idEstudiante);
          // Paso 2: Obtener todas las notas para ese IdEstudiante
          this.notaService.getNotasByEstudianteId(estudiante.idEstudiante).subscribe({
            next: (notas: Nota[]) => {
              console.log('Notas recibidas:', notas);
              this.allNotas = notas; // Asigna directamente todas las notas al dataSource
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error al obtener notas del estudiante:', err);
              this.snackBar.open('Error al cargar las notas: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
              this.isLoading = false;
            }
          });
        } else {
          this.snackBar.open('No se encontró información de estudiante para su usuario.', 'Cerrar', { duration: 5000 });
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener estudiante por ID de usuario:', err);
        this.snackBar.open('Error al obtener su información de estudiante: ' + (err.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
}
