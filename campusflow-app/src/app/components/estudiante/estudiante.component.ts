import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, tap, catchError, of } from 'rxjs';
import { Estudiante } from '../../model/estudiante';
import { EstudianteService } from '../../services/estudiante.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estudiante',
  imports: [
    // Angular Common and Forms modules
    CommonModule,
    ReactiveFormsModule, 
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule // Needed for MatDatepicker
  ],
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.css'
})
export class ListarEstudiantesComponent implements OnInit { // Implemented OnInit

  // Data source para la tabla de Material
  dataSource = new MatTableDataSource<Estudiante>();
  // Columnas a mostrar en la tabla, basadas en la interfaz Estudiante
  displayedColumns: string[] = ['IdEstudiante', 'Ciclo', 'idCarrera', 'idUsuario', 'Estado'];

  // ViewChild decorators to access MatPaginator and MatSort from the template
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = true;
  errorMessage: string | null = null;

  // Formulario para el filtro de fechas
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private estudianteService: EstudianteService) { }

  ngOnInit(): void {
    this.loadAllStudents(); // Cargar todos los estudiantes al inicio
  }

  // Método genérico para aplicar los filtros
  private applyFilter(observable: Observable<Estudiante[]>, filterName: string = 'todos'): void {
    this.isLoading = true;
    this.errorMessage = null;

    observable.pipe(
      tap(students => {
        console.log(`Estudiantes cargados con filtro ${filterName}:`, students);
      }),
      catchError(error => {
        console.error(`Error al cargar estudiantes con filtro ${filterName}:`, error);
        this.errorMessage = `Error al cargar los estudiantes: ${error.message || 'Error desconocido'}`;
        this.isLoading = false;
        return of([]); // Retorna un observable vacío para que el pipe no falle
      })
    ).subscribe(students => {
      this.dataSource.data = students;
      this.isLoading = false;
      // Una vez que los datos se han establecido, asignar paginador y sort
      // Esto es importante para que MatTableDataSource tenga acceso a ellos
      setTimeout(() => { // Using setTimeout to ensure paginator/sort are rendered
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      });
    });
  }

  // --- Métodos de Filtrado ---

  loadAllStudents(): void {
    this.applyFilter(this.estudianteService.listar(), 'todos');
  }

  // Nota: Estos métodos asumen que el backend sigue devolviendo un 'promedioNotas'
  // o que la interfaz Estudiante es solo una parte de un objeto más grande
  // que se devuelve para estos filtros. Si no es así, la tabla no mostrará esa columna.
  loadStudentsWithLowGrades(): void {
    this.applyFilter(this.estudianteService.obtenerEstudiantesConNotaBaja(), 'nota baja');
  }

  loadTopDecileStudents(): void {
    this.applyFilter(this.estudianteService.obtenerTopDecimo(), 'top décimo');
  }

  filterByEventDates(): void {
    const startDate = this.range.value.start;
    const endDate = this.range.value.end;

    if (startDate && endDate) {
      // Formatear las fechas a 'YYYY-MM-DD' o el formato que tu API espere
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      this.applyFilter(this.estudianteService.obtenerPorFechas(formattedStartDate, formattedEndDate), 'por fechas de eventos');
    } else {
      this.errorMessage = 'Por favor, selecciona un rango de fechas válido.';
    }
  }

  // Aplicar filtro de búsqueda global en la tabla
  // Este filtro buscará en todas las columnas visibles de la tabla.
  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Manejar el cambio en las fechas del datepicker (opcional, el botón ya lo hace)
  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(`${type}: ${event.value}`);
  }
}