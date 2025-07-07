import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Evento } from '../model/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = `${environment.apiUrl}/evento`;

  constructor(private http: HttpClient) {}

  // Listar todos los eventos
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener evento por ID
  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear nuevo evento
  createEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento).pipe(
      catchError(this.handleError)
    );
  }

  // Modificar evento existente
  updateEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar evento (lógico)
  deleteEvento(id: number): Observable<Evento> {
    return this.http.delete<Evento>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Listar eventos por ID de profesor
  getEventosByProfesorId(idProfesor: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/profesor/${idProfesor}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener próximos 5 eventos para un estudiante
  getProximos5EventosDeEstudiante(idEstudiante: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/estudiante/${idEstudiante}/proximos`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener top 3 eventos con mayor participación
  getTop3EventosConMasParticipacion(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/top3-participacion`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener eventos por ID de carrera (profesor)
  getEventosByCarreraId(idCarrera: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/carrera/${idCarrera}`).pipe(
      catchError(this.handleError)
    );
  }

  // Unir estudiante a evento
  joinEvento(idEvento: number, idEstudiante: number): Observable<Evento> {
    return this.http.post<Evento>(`${this.apiUrl}/${idEvento}/unirse/${idEstudiante}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado en EventoService.';
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
    console.error('Error en EventoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
