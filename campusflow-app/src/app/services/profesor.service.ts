import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Profesor } from '../model/profesor';
import { RegisterProfesorPayload } from '../model/RegisterProfesorPayload';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = `${environment.apiUrl}/profesor`;

  constructor(private http: HttpClient) {}

  /**
   * Registrar un nuevo profesor (registro combinado con usuario).
   */
  registerProfesor(payload: RegisterProfesorPayload): Observable<Profesor> {
    return this.http.post<Profesor>(`${this.apiUrl}/register`, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener todos los profesores.
   */
  getAllProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Guardar un profesor (modo básico, sin registro de usuario).
   */
  saveProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.post<Profesor>(this.apiUrl, profesor).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar un profesor.
   */
  updateProfesor(id: number, profesor: Profesor): Observable<Profesor> {
    return this.http.put<Profesor>(`${this.apiUrl}/${id}`, profesor).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar lógicamente un profesor.
   */
  deleteProfesor(id: number): Observable<Profesor> {
    return this.http.delete<Profesor>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores genérico.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en ProfesorService.';
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
    console.error('Error en ProfesorService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
