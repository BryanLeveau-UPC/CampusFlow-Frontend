import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs'; 
import { AuthRequest, AuthResponse } from '../model/Auth'; 
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, authRequest).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
        console.log('Login successful, JWT token stored.');
        this.router.navigate(['/dashboard']);
      }),
      catchError(this.handleError) 
    );
  }

  // Make sure you have this private handleError method
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      if (error.status === 401 || error.status === 400) {
        errorMessage = error.error || 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.';
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en AuthService:', errorMessage);
    return throwError(() => new Error(errorMessage)); 
  }
}