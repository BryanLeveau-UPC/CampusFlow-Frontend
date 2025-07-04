import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tarea } from '../model/tarea';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private BASE_API_URL = environment.apiUrl+"/tareas";

  constructor(private http: HttpClient) {}
  listar(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.BASE_API_URL);
  }
  registrar(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.BASE_API_URL, tarea);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_API_URL}/${id}`);
  }
  obtenerPorId(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.BASE_API_URL}/${id}`);
  }
}
