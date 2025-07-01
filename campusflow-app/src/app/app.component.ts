import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    RouterOutlet, 
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'campusflow-app';
    showNavbar: boolean = true; // Por defecto, la barra de navegación global es visible

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Nos suscribimos a los eventos de navegación del router
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Ocultamos la navbar global si la URL actual comienza con '/estudiante-dashboard'
      // Puedes añadir más rutas aquí si también quieres ocultarla en otras páginas específicas
      this.showNavbar = !event.urlAfterRedirects.startsWith('/estudiante-dashboard');
    });
  }
}
