import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Recompensa } from '../../../model/recompensa';
import { AuthService } from '../../../services/auth.service';
import { RecompensaService } from '../../../services/recompensa.service';

@Component({
  selector: 'app-recompensa-listar',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './recompensa-listar.component.html',
  styleUrl: './recompensa-listar.component.css'
})
export class RecompensaListarComponent implements OnInit {
  recompensas: Recompensa[] = [];
  isLoading = false;
  displayedColumns: string[] = ['plataforma', 'url']; // Columnas para la tabla

  constructor(
    private recompensaService: RecompensaService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRecompensas();
  }

  loadRecompensas(): void {
    this.isLoading = true;
    const userId = this.authService.getUserId();

    if (userId) {
      this.recompensaService.listar().subscribe({
        next: (data) => {
          this.recompensas = data;
          this.isLoading = false;
          if (this.recompensas.length === 0) {
            this.mostrarMensaje('No tienes recompensas registradas aún.', 'info-snackbar');
          }
        },
        error: (error) => {
          console.error('Error al cargar las recompensas:', error);
          this.mostrarMensajeError('Error al cargar tus recompensas. Inténtalo de nuevo más tarde.');
          this.isLoading = false;
        }
      });
    } else {
      this.mostrarMensajeError('No se pudo obtener el ID del usuario. Por favor, inicia sesión.');
      this.isLoading = false;
      this.router.navigate(['/login']); // Redirigir al login si no hay ID de usuario
    }
  }

  viewRecompensa(url: string): void {
    if (url) {
      window.open(url, '_blank'); // Abre la URL en una nueva pestaña
    } else {
      this.mostrarMensaje('URL de recompensa no disponible.', 'warn-snackbar');
    }
  }

  private mostrarMensaje(mensaje: string, panelClass: string = 'info-snackbar'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  private mostrarMensajeError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}

