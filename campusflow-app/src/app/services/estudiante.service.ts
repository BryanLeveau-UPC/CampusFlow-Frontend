import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Estudiante } from '../model/estudiante';
import { RegisterEstudiantePayload } from '../model/RegisterEstudiantePayload';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'http://localhost:8080'; // La URL base de tu backend

  constructor(private http: HttpClient) { }

  /**
   * Envía los datos de registro de un nuevo estudiante al backend.
   * @param payload Los datos del formulario de registro.
   * @returns Un Observable con el EstudianteDTO del estudiante registrado.
   */
  
  registerEstudiante(payload: RegisterEstudiantePayload): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${this.apiUrl}/estudiante/register`, payload).pipe(
      catchError(error => {
        console.error('Error al registrar estudiante:', error);
        // Puedes personalizar el mensaje de error basándote en el código de estado o el cuerpo de la respuesta
        let errorMessage = 'Error al registrar el estudiante. Inténtelo de nuevo.';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error; // Si el backend envía un mensaje de error simple
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message; // Si el backend envía un objeto con una propiedad 'message'
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
