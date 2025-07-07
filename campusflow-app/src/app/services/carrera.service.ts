import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Carrera } from '../model/carrera';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private apiUrl = `${environment.apiUrl}/carrera`;

  constructor(private http: HttpClient) { }

  // Obtener todas las carreras
  getAllCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener carreras:', error);
        return throwError(() => new Error('Error al cargar las carreras.'));
      })
    );
  }

  // Listar (redundante con getAllCarreras, puedes usar solo uno)
  listar(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.apiUrl);
  }

  // Registrar carrera
  registrar(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(this.apiUrl, carrera);
  }

  // Eliminar lógico
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener por ID
  obtenerPorId(id: number): Observable<Carrera> {
    return this.http.get<Carrera>(`${this.apiUrl}/${id}`);
  }

  // Modificar carrera
  modificar(id: number, carrera: Carrera): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.apiUrl}/${id}`, carrera);
  }
}
