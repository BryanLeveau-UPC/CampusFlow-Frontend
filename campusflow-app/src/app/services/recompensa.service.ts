import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Recompensa } from '../model/recompensa';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecompensaService {
  private API = `${environment.apiUrl}/recompensa`;

  constructor(private http: HttpClient) { }

  // Listar todas las recompensas activas
  listar(): Observable<Recompensa[]> {
    return this.http.get<Recompensa[]>(this.API).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener una recompensa por ID
  obtenerPorId(id: number): Observable<Recompensa> {
    return this.http.get<Recompensa>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Registrar una nueva recompensa
  registrar(recompensa: Recompensa): Observable<Recompensa> {
    return this.http.post<Recompensa>(this.API, recompensa).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar una recompensa existente
  actualizar(id: number, recompensa: Recompensa): Observable<Recompensa> {
    return this.http.put<Recompensa>(`${this.API}/${id}`, recompensa).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar lógicamente una recompensa
  eliminar(id: number): Observable<Recompensa> {
    return this.http.delete<Recompensa>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en RecompensaService.';
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
    console.error('Error en RecompensaService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
