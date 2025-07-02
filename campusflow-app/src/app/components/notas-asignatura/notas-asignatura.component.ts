import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { NotasAgrupadasDTO } from '../../model/NotasAgrupadas';
import { Nota } from '../../model/nota';
import { Estudiante } from '../../model/estudiante';
import { AuthService } from '../../services/auth.service';
import { EstudianteService } from '../../services/estudiante.service';
import { NotaService } from '../../services/nota.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notas-asignatura',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './notas-asignatura.component.html',
  styleUrl: './notas-asignatura.component.css'
})
export class NotasAsignaturaComponent {
  notasAgrupadas: NotasAgrupadasDTO[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['tipo', 'puntaje', 'peso'];
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

    if (!userId) {
      this.snackBar.open('Error: ID de usuario no encontrado. Por favor, inicie sesión nuevamente.', 'Cerrar', { duration: 5000 });
      this.isLoading = false;
      return;
    }

    this.estudianteService.getEstudianteByUserId(userId).subscribe({
      next: (estudiante: Estudiante) => {
        if (estudiante && estudiante.IdEstudiante) {
          console.log('Estudiante ID encontrado:', estudiante.IdEstudiante);
          this.notaService.getNotasByEstudianteId(estudiante.IdEstudiante).subscribe({
            next: (notas: Nota[]) => {
              console.log('Notas recibidas:', notas);
              this.notasAgrupadas = this.groupAndCalculatePromedio(notas);
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

  private groupAndCalculatePromedio(notas: Nota[]): NotasAgrupadasDTO[] {
    const grouped: { [key: number]: NotasAgrupadasDTO } = {};

    notas.forEach(nota => {
      if (nota.id_asignatura && nota.nombreAsignatura) {
        if (!grouped[nota.id_asignatura]) {
          grouped[nota.id_asignatura] = {
            nombreAsignatura: nota.nombreAsignatura,
            idAsignatura: nota.id_asignatura,
            notas: [],
            promedio: 0,
            Estado: false
          };
        }
        grouped[nota.id_asignatura].notas.push(nota);
      }
    });

    return Object.values(grouped).map(grupo => {
      let sumatoriaPonderada = 0;
      let sumatoriaPesos = 0;
      grupo.notas.forEach(nota => {
        sumatoriaPonderada += nota.Puntaje * nota.Peso_Nota;
        sumatoriaPesos += nota.Peso_Nota;
      });
      grupo.promedio = sumatoriaPesos > 0 ? sumatoriaPonderada / sumatoriaPesos : 0;
      return grupo;
    }).sort((a, b) => a.nombreAsignatura.localeCompare(b.nombreAsignatura));
  }

  getPromedioColor(promedio: number): string {
    if (promedio >= 14) {
      return 'text-green-600';
    } else if (promedio >= 11) {
      return 'text-yellow-600';
    } else {
      return 'text-red-600';
    }
  }
}
