import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario } from '../model/horario';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private API = `${environment.apiUrl}/horario`;

  constructor(private http: HttpClient) { }
    listar(): Observable<Horario[]> {
      return this.http.get<Horario[]>(this.API);
    }
    registrar(horario: Horario): Observable<Horario> {
      return this.http.post<Horario>(this.API, horario);
    }
    eliminar(id: number): Observable<void> {
      return this.http.delete<void>(`${this.API}/${id}`);
    }
    obtenerPorId(id: number): Observable<Horario> {
      return this.http.get<Horario>(`${this.API}/${id}`);
    }
}
