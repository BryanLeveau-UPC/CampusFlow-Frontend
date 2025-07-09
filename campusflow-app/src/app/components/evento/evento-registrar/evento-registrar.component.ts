import { Component, OnInit } from '@angular/core';
import { DashboardNavbarComponent } from '../../dashboard/dashboard-navbar/dashboard-navbar.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Evento } from '../../../model/evento';
import { EventoService } from '../../../services/evento.service';
import { DashboardNavbarProfesorComponent } from "../../dashboard-navbar-profesor/dashboard-navbar-profesor.component";
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-evento-registrar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DashboardNavbarProfesorComponent,
],
  templateUrl: './evento-registrar.component.html',
  styleUrl: './evento-registrar.component.css', 
})
export class EventoRegistrarComponent implements OnInit {
  eventoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      puntajeRecompensa: [0, [Validators.required, Validators.min(0)]],
      estado: [true]
    });
  }

  registrarEvento(): void {
    if (this.eventoForm.valid) {
      const evento: Evento = {
        ...this.eventoForm.value,
        fechaInicio: this.eventoForm.value.fechaInicio.toISOString().split('T')[0],
        fechaFin: this.eventoForm.value.fechaFin.toISOString().split('T')[0],
        idProfesor: 1, 
      };

      this.eventoService.createEvento(evento).subscribe({
        next: () => {
          alert('Evento registrado correctamente');
          this.router.navigate(['/dashboard-profesor']);
        },
        error: (err) => alert('Error al registrar: ' + err.message)
      });
    }
  }
}
