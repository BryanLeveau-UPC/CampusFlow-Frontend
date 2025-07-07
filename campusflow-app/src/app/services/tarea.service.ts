import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Tarea } from '../model/tarea';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = `${environment.apiUrl}/tareas`; // URL base para el controlador de tareas

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las tareas.
   * @returns Un Observable con un array de Tarea.
   */
  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene todas las tareas activas para un estudiante específico.
   * @param idEstudiante El ID del estudiante.
   * @returns Un Observable con un array de Tarea.
   */
  getTareasActivasPorEstudiante(idEstudiante: number): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.apiUrl}/estudiante/${idEstudiante}/activas`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene tareas por prioridad y las ordena por fecha límite.
   * @param prioridad La prioridad ('Alta', 'Media', 'Baja').
   * @returns Un Observable con un array de Tarea.
   */
  getTareasPorPrioridad(prioridad: string): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.apiUrl}/prioridad/${prioridad}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva tarea.
   * @param tarea Los datos de la tarea a crear.
   * @returns Un Observable con la Tarea creada.
   */
  createTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una tarea existente.
   * @param id El ID de la tarea a actualizar.
   * @param tarea Los datos actualizados de la tarea.
   * @returns Un Observable con la Tarea actualizada.
   */
  updateTarea(id: number, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, tarea).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina lógicamente una tarea por su ID.
   * @param id El ID de la tarea a eliminar.
   * @returns Un Observable con la Tarea eliminada.
   */
  deleteTarea(id: number): Observable<Tarea> {
    return this.http.delete<Tarea>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja los errores de las peticiones HTTP.
   * @param error El error HTTP.
   * @returns Un Observable con un error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en TareaService.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      // El backend devolvió un código de respuesta de error.
      if (typeof error.error === 'string') {
        errorMessage = error.error; // Mensaje simple
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message; // Objeto con campo message
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en TareaService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
