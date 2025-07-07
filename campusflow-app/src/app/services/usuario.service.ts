import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../model/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  /**
   * Lista todos los usuarios.
   */
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Registra un nuevo usuario.
   */
  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API, usuario).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un usuario por su ID.
   */
  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Modifica un usuario existente.
   */
  modificar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API}/${id}`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina lógicamente un usuario.
   */
  eliminar(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores para peticiones HTTP.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error en UsuarioService.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
    }
    console.error('Error en UsuarioService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
