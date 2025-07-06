import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GrupoForo } from '../model/grupoForo';

@Injectable({
  providedIn: 'root'
})
export class GrupoForoService {
  private apiUrl = `${environment.apiUrl}/grupoForo`; // <- Nombre corregido para coincidir con el controlador

  constructor(private http: HttpClient) {}

  /**
   * Lista todos los grupos de foro.
   */
  getGruposForo(): Observable<GrupoForo[]> {
    return this.http.get<GrupoForo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener un grupo de foro por ID.
   */
  getGrupoForoById(id: number): Observable<GrupoForo> {
    return this.http.get<GrupoForo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear un nuevo grupo de foro.
   */
  createGrupoForo(grupoForo: GrupoForo): Observable<GrupoForo> {
    return this.http.post<GrupoForo>(this.apiUrl, grupoForo).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar un grupo de foro por ID.
   */
  updateGrupoForo(id: number, grupoForo: GrupoForo): Observable<GrupoForo> {
    return this.http.put<GrupoForo>(`${this.apiUrl}/${id}`, grupoForo).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar lógicamente un grupo de foro.
   */
  deleteGrupoForo(id: number): Observable<GrupoForo> {
    return this.http.delete<GrupoForo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en GrupoForoService.';
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
    console.error('Error en GrupoForoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
