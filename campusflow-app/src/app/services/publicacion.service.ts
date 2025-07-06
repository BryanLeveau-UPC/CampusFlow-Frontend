import { Injectable } from '@angular/core';
import { Publicacion } from '../model/publicacion';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = `${environment.apiUrl}/publicacion`; // Ruta base del backend

  constructor(private http: HttpClient) { }

  // Obtener todas las publicaciones
  getPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener publicación por ID
  getPublicacionById(id: number): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear nueva publicación
  createPublicacion(publicacion: Publicacion): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.apiUrl, publicacion).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar publicación
  updatePublicacion(id: number, publicacion: Publicacion): Observable<Publicacion> {
    return this.http.put<Publicacion>(`${this.apiUrl}/${id}`, publicacion).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar publicación
  deletePublicacion(id: number): Observable<Publicacion> {
    return this.http.delete<Publicacion>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  getPublicacionesByGrupoForo(idGrupoForo: number): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/grupo/${idGrupoForo}`).pipe(
      catchError(this.handleError)
    );
  }


  getPublicacionesByGrupoForoAndLabel(idGrupoForo: number, label: string): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/grupo/${idGrupoForo}/label/${label}`).pipe(
      catchError(this.handleError)
    );
  }


  getPublicacionesByGrupoForoAndFecha(idGrupoForo: number, fecha: string): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/grupo/${idGrupoForo}/fecha/${fecha}`).pipe(
      catchError(this.handleError)
    );
  }


  getResumenPorLabel(): Observable<{ [label: string]: number }> {
    return this.http.get<{ [label: string]: number }>(`${this.apiUrl}/resumen/label`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en PublicacionService.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en PublicacionService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
