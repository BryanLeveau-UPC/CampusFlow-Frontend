import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recompensa } from '../model/recompensa';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecompensaService {
  private API = `${environment.apiUrl}/recompensa`; 
  
  constructor(private http: HttpClient) { }
    listar(): Observable<Recompensa[]> {
    return this.http.get<Recompensa[]>(this.API);
  }
  registrar(recompensa: Recompensa): Observable<Recompensa> {
    return this.http.post<Recompensa>(this.API, recompensa);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
  obtenerPorId(id: number): Observable<Recompensa> {
    return this.http.get<Recompensa>(`${this.API}/${id}`);
  }
}
