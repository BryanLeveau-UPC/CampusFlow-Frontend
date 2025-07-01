import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs'; 
import { AuthRequest, AuthResponse } from '../model/Auth'; 
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Usuario } from '../model/usuario';
import { RegisterEstudiantePayload } from '../model/RegisterEstudiantePayload';
import { Estudiante } from '../model/estudiante';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_API_URL = environment.apiUrl + '/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_API_URL}/login`, authRequest).pipe(
      tap(response => {
        // Almacenar el token, el rol y el ID del usuario en localStorage
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('user_role', response.role); // Almacena el rol
        localStorage.setItem('user_id', response.userId.toString()); // Almacena el ID (como string)

        console.log('Login successful, JWT token, role, and user ID stored.');
        console.log(response.role)
        console.log(response.userId)

        // Redirigir basado en el rol del usuario
        if (response.role === 'ROLE_ESTUDIANTE') { // Usa el nombre de rol exacto de tu backend (ej. "ESTUDIANTE", "ROLE_ESTUDIANTE")
          this.router.navigate(['/dashboard-estudiante']);
        } else if (response.role === 'ROLE_PROFESOR') { // Si tienes un dashboard para profesores
          this.router.navigate(['/dashboard-profesor']); // Asegúrate de tener esta ruta y componente
        } else {
          // Redirección por defecto si el rol no es reconocido o es otro
          this.router.navigate(['/default-dashboard']); // Crea una página de dashboard genérica si es necesario
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Registra un nuevo estudiante, creando primero el Usuario y luego el Estudiante.
   * Corresponde a las llamadas POST /usuarios y POST /estudiante en tu backend.
   * @param payload Los datos combinados de usuario y estudiante para el registro.
   * @returns Un Observable con la respuesta del registro del estudiante.
   */
  registerEstudiante(payload: RegisterEstudiantePayload): Observable<any> {
    // Paso 1: Crear el Usuario
    const usuarioDTO: Usuario = {
      nombre: payload.nombre,
      apellido: payload.apellido,
      email: payload.email,
      username: payload.username,
      password: payload.password, // La contraseña se encripta en el backend
      rolId: 2, // ¡IMPORTANTE! Confirma el ID de tu rol "ESTUDIANTE" en tu BD (ej. 2)
      Estado: true // Estado por defecto
    };

    return this.http.post<Usuario>(`${this.BASE_API_URL}/usuarios`, usuarioDTO).pipe(
      // Paso 2: Usar el ID del usuario recién creado para registrar el Estudiante
      switchMap(responseUsuario => {
        if (!responseUsuario.idUsuario) {
          // Si el backend no devuelve el idUsuario, esto sería un problema
          return throwError(() => new Error('El backend no devolvió el ID del usuario creado.'));
        }

        const estudianteDTO: Estudiante = {
          IdEstudiante: 0, // El backend lo generará, pero se necesita para el tipo
          Ciclo: payload.ciclo,
          idCarrera: payload.idCarrera,
          idUsuario: responseUsuario.idUsuario, // Usamos el ID del usuario ya creado
          Estado: true // Estado por defecto
        };
        return this.http.post<Estudiante>(`${this.BASE_API_URL}/estudiante`, estudianteDTO);
      }),
      catchError(this.handleError) // Maneja errores de cualquiera de las dos llamadas
    );
  }

  // Métodos de autenticación JWT (getToken, isAuthenticated, logout)
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role'); // Elimina el rol al cerrar sesión
    localStorage.removeItem('user_id');   // Elimina el ID al cerrar sesión
    console.log('Logged out, token and user info removed.');
    this.router.navigate(['/login']);
  }

  // Nuevos métodos para obtener el rol y el ID del usuario desde localStorage
  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? +userId : null; // Convierte la cadena a número
  }

  // Manejador de errores centralizado
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    } else {
      // Intenta obtener un mensaje de error más específico del backend
      if (typeof error.error === 'string') {
        errorMessage = error.error; // Si el backend envía un mensaje de error plano
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message; // Si el backend envía un JSON con 'message'
      } else if (error.status === 409) { // Conflict (e.g., username/email already exists)
        errorMessage = 'El usuario o email ya están registrados.';
      } else if (error.status === 400) { // Bad Request
        errorMessage = 'Datos de solicitud inválidos. Verifique la información.';
      } else if (error.status === 401) { // Unauthorized
        errorMessage = 'Acceso no autorizado. Credenciales inválidas o token expirado.';
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
      }
    }
    console.error('Error en AuthService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
