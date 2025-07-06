import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Nota } from '../model/nota';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private apiUrl = `${environment.apiUrl}/nota`; // ✅ coincide con el backend

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las notas de un estudiante.
   */
  getNotasByEstudianteId(idEstudiante: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/estudiante/${idEstudiante}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener notas de un estudiante dentro de un rango de puntaje.
   */
  getNotasByEstudianteYRango(idEstudiante: number, puntajeMinimo: number, puntajeMaximo: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(
      `${this.apiUrl}/estudiante/${idEstudiante}/rango`,
      {
        params: {
          puntajeMinimo: puntajeMinimo.toString(),
          puntajeMaximo: puntajeMaximo.toString()
        }
      }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Obtener notas por asignatura.
   */
  getNotasByAsignatura(idAsignatura: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/asignatura/${idAsignatura}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Guardar una nota nueva.
   */
  guardarNota(nota: Nota): Observable<Nota> {
    return this.http.post<Nota>(this.apiUrl, nota).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Modificar una nota.
   */
  modificarNota(id: number, nota: Nota): Observable<Nota> {
    return this.http.put<Nota>(`${this.apiUrl}/${id}`, nota).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar lógico de una nota.
   */
  eliminarNota(id: number): Observable<Nota> {
    return this.http.delete<Nota>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en NotaService.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en NotaService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
