import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estudiante } from '../model/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private API = 'http://localhost:8080/api/campusflow/estudiantes';

  constructor(private http: HttpClient) {}
  listar(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.API);
  }
  registrar(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.API, estudiante);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
  obtenerPorId(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.API}/${id}`);
  }
}
