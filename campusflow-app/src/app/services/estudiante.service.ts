import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Estudiante } from '../model/estudiante';
import { RegisterEstudiantePayload } from '../model/RegisterEstudiantePayload';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/estudiante`;

  constructor(private http: HttpClient) {}

  /**
   * Registro de estudiante + usuario (nuevo endpoint: /estudiante/register)
   */
  registerEstudiante(payload: RegisterEstudiantePayload): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${this.apiUrl}/register`, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener todos los estudiantes
   */
  listar(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener estudiante por su ID
   */
  buscarPorId(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Guardar un estudiante (POST simple)
   */
  guardar(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, estudiante).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Modificar un estudiante
   */
  modificar(id: number, estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, estudiante).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar lógico de estudiante
   */
  eliminar(id: number): Observable<Estudiante> {
    return this.http.delete<Estudiante>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener estudiantes con promedio menor a 11
   */
  obtenerEstudiantesConNotaBaja(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/promedio/menor-a-11`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener top 10% estudiantes
   */
  obtenerTopDecimo(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/top-decimo`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener estudiantes por rango de fechas de eventos
   */
  obtenerPorFechas(inicio: string, fin: string): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/estudiantes/eventos`, {
      params: {
        inicio,
        fin
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener estudiante por ID de usuario
   */
  getEstudianteByUserId(idUsuario: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/busca-por-usuario/${idUsuario}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado.';
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
    console.error('Error en EstudianteService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

    // Obtener ID de carrera por ID de usuario
  getCarreraIdByUserId(userId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/carrera-por-usuario/${userId}`
    );
  }

}
