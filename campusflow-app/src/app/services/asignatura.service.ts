import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asignatura } from '../model/asignatura';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {
  private API = `${environment.apiUrl}/asignatura`; 

    constructor(private http: HttpClient) {}
  listar(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(this.API);
  }
  registrar(asignatura: Asignatura): Observable<Asignatura> {
    return this.http.post<Asignatura>(this.API, asignatura);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
  obtenerPorId(id: number): Observable<Asignatura> {
    return this.http.get<Asignatura>(`${this.API}/${id}`);
  }
  
}
