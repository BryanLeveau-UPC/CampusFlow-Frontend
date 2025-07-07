import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recurso } from '../model/recurso';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  private apiUrl = `${environment.apiUrl}/recurso`; // usa /recurso o /recursos, pero igual al backend

  constructor(private http: HttpClient) { }

  // Listar todos los recursos
  getRecursos(): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un recurso por ID
  getRecursoById(id: number): Observable<Recurso> {
    return this.http.get<Recurso>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo recurso
  createRecurso(recurso: Recurso): Observable<Recurso> {
    return this.http.post<Recurso>(this.apiUrl, recurso).pipe(
      catchError(this.handleError)
    );
  }

  // Modificar un recurso
  updateRecurso(id: number, recurso: Recurso): Observable<Recurso> {
    return this.http.put<Recurso>(`${this.apiUrl}/${id}`, recurso).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar lógicamente un recurso
  deleteRecurso(id: number): Observable<Recurso> {
    return this.http.delete<Recurso>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en RecursoService.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en RecursoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
