import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importar RouterModule para routerLink
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule para mat-button
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule si usas <mat-icon>

@Component({
  selector: 'app-index',
  standalone: true, // Asegúrate de que tu componente sea standalone si lo estás usando así
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule // Solo si usas <mat-icon> en tu HTML
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  title = 'CampusFlow';
}
