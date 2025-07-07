import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../model/usuario';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-navbar-profesor',
  imports: [
    
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule, // Añadir MatToolbarModule aquí
    RouterModule,
  ],
  templateUrl: './dashboard-navbar-profesor.component.html',
  styleUrl: './dashboard-navbar-profesor.component.css'
})
export class DashboardNavbarProfesorComponent  implements OnInit {
  userName: string = 'Usuario'; // Propiedad para almacenar el nombre del usuario
  userAvatar: string = 'img/user_profile1.png'; // Ruta por defecto del avatar

  constructor(private authService: AuthService) {} // Inyectar AuthService

  ngOnInit(): void {
    this.loadUserName();
    
  }

  loadUserName(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getUserDetails(userId).subscribe(
        (usuario: Usuario) => {
          this.userName = `${usuario.nombre} ${usuario.apellido}`;
        },
        (error) => {
          console.error('Error al cargar los detalles del usuario:', error);
          this.userName = 'Error al cargar'; // Mostrar un mensaje de error
        }
      );
    } else {
      console.warn('ID de usuario no encontrado en localStorage.');
      this.userName = 'Invitado';
    }
  }
    logout(): void {
    this.authService.logout();
  }
}