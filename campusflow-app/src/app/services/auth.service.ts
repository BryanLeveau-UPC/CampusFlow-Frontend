import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthRequest, AuthResponse } from '../model/AuthRequest';
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
      }),
    );
  }

}
