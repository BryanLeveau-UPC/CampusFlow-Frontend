import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Horario } from '../model/horario';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = `${environment.apiUrl}/horarios`; // <- corregido a plural para coincidir con el backend

  constructor(private http: HttpClient) {}

  /**
   * Lista todos los horarios.
   */
  listar(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Registrar un nuevo horario.
   */
  registrar(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, horario).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar lógicamente un horario.
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener un horario por su ID.
   */
  obtenerPorId(id: number): Observable<Horario> {
    return this.http.get<Horario>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores centralizado.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en HorarioService.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en HorarioService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
