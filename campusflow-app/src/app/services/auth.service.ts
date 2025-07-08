// src/app/services/auth.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, tap, throwError, of, map } from 'rxjs';
import { AuthRequest, AuthResponse } from '../model/Auth';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Usuario } from '../model/usuario'; // Asegúrate de que este modelo pueda incluir idCarrera
import { RegisterEstudiantePayload } from '../model/RegisterEstudiantePayload';
import { Estudiante } from '../model/estudiante';
import { JwtRequest } from '../model/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_API_URL = environment.apiUrl;
  private jwtHelper: JwtHelperService = new JwtHelperService(); // Instancia de JwtHelperService

  constructor(private http: HttpClient, private router: Router) { } // Inyectar Router aquí

  // El método login ahora devuelve Observable<AuthResponse> y almacena los datos
  login(request: JwtRequest): Observable<AuthResponse> {
    // Asumo que tu endpoint de login devuelve AuthResponse { token, role, userId }
    return this.http.post<AuthResponse>(`${this.BASE_API_URL}/auth/login`, request).pipe( // Ajusta la URL si es solo /login
      tap(response => {
        // Almacenar el token, el rol y el ID del usuario en sessionStorage
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user_role', response.role); // Almacenar el rol directamente
        sessionStorage.setItem('user_id', response.userId.toString()); // Almacenar el userId

        console.log('Login successful, JWT token, role, and user ID stored in sessionStorage.');
        console.log('Rol recibido y almacenado:', response.role);
        console.log('ID de usuario recibido y almacenado:', response.userId);

        // Redirigir basado en el rol del usuario
        if (response.role === 'ROLE_ESTUDIANTE') {
          this.router.navigate(['/dashboard-estudiante']);
        } else if (response.role === 'ROLE_PROFESOR') {
          this.router.navigate(['/dashboard-profesor']);
        } else {
          this.router.navigate(['/default-dashboard']); // O a una página de error/genérica
        }
      }),
      catchError(this.handleError)
    );
  }

  // Método para verificar si el usuario está logueado (tiene token válido)
  verificar(): boolean {
    let token = sessionStorage.getItem('token');
    // Verificar si el token existe y no ha expirado
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  // Método para obtener el rol del usuario desde el token decodificado
  getUserRole(): string | null {
    let token = sessionStorage.getItem('token');
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      return null;
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    // Asumo que el rol está en una propiedad 'role' en el payload del token
    // Si tu backend usa otro nombre (ej. 'authorities', 'scopes'), ajústalo aquí
    return decodedToken?.role || null;
  }

  // Método para obtener el ID del usuario desde sessionStorage
  getUserId(): number | null {
    const userId = sessionStorage.getItem('user_id');
    return userId ? +userId : null; // Convierte a número
  }

  // Método para obtener el token (usado por el interceptor)
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Método para cerrar sesión
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_id');
    console.log('Logged out, token and user info removed from sessionStorage.');
    this.router.navigate(['/login']);
  }

  // --- Métodos de registro de estudiante y obtención de detalles de usuario (mantener como estaban) ---
  registerEstudiante(payload: RegisterEstudiantePayload): Observable<any> {
    const usuarioDTO: Usuario = {
      nombre: payload.nombre,
      apellido: payload.apellido,
      email: payload.email,
      username: payload.username,
      password: payload.password,
      rolId: 2, // ¡IMPORTANTE! Confirma el ID de tu rol "ESTUDIANTE" en tu BD (ej. 2)
      Estado: true
    };

    return this.http.post<Usuario>(`${this.BASE_API_URL}/usuarios`, usuarioDTO).pipe(
      switchMap(responseUsuario => {
        if (!responseUsuario.idUsuario) {
          return throwError(() => new Error('El backend no devolvió el ID del usuario creado.'));
        }

        const estudianteDTO: Estudiante = {
          idEstudiante: 0,
          Ciclo: payload.ciclo,
          idCarrera: payload.idCarrera,
          idUsuario: responseUsuario.idUsuario,
          Estado: true
        };
        return this.http.post<Estudiante>(`${this.BASE_API_URL}/estudiante`, estudianteDTO);
      }),
      catchError(this.handleError)
    );
  }

  getUserDetails(userId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.BASE_API_URL}/usuarios/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene el ID de la carrera del profesor actual directamente del JWT.
   * Asume que el 'idCarrera' está incluido en el payload del token.
   * @returns Observable<number | null> El ID de la carrera del profesor, o null si no se encuentra o el token no es válido.
   */
  getProfesorCarreraId(): Observable<number | null> {
    const token = this.getToken();
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      console.warn('No hay token o el token ha expirado. No se puede obtener idCarrera del JWT.');
      return of(null);
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      // *** IMPORTANTE: Asegúrate de que tu backend incluya 'idCarrera' en el payload del JWT. ***
      // Si tu backend usa un nombre diferente para la propiedad, ajústalo aquí (ej. decodedToken.carreraId)
      const idCarrera = decodedToken?.idCarrera || null;
      if (idCarrera === null) {
        console.warn('La propiedad "idCarrera" no se encontró en el payload del JWT.');
      }
      return of(idCarrera);
    } catch (error) {
      console.error('Error al decodificar el token JWT para obtener idCarrera:', error);
      return of(null);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 409) {
        errorMessage = 'El usuario o email ya están registrados.';
      } else if (error.status === 400) {
        errorMessage = 'Datos de solicitud inválidos. Verifique la información.';
      } else if (error.status === 401) {
        errorMessage = 'Acceso no autorizado. Credenciales inválidas o token expirado.';
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en AuthService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
