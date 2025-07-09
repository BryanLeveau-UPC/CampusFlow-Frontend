import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../model/tarea';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  chartLabels: string[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };
  chartLegend = true;
  chartType: ChartType = 'bar';

  constructor(private tareaService: TareaService) {}

  ngOnInit(): void {
    console.log('[DEBUG] ngOnInit ejecutado');
    this.cargarDatos();
  }

  cargarDatos(): void {
    const idEstudiante = Number(localStorage.getItem('id_estudiante'));
    if (!idEstudiante) return;

    console.log('[DEBUG] ID del estudiante:', idEstudiante);

    this.tareaService.getTareasActivasPorEstudiante(idEstudiante).subscribe((tareas: Tarea[]) => {
      const hoy = new Date();
      const dias: string[] = [];

      for (let i = 6; i >= 0; i--) {
        const dia = new Date();
        dia.setDate(hoy.getDate() - i);
        const yyyy = dia.getFullYear();
        const mm = (dia.getMonth() + 1).toString().padStart(2, '0');
        const dd = dia.getDate().toString().padStart(2, '0');
        dias.push(`${yyyy}-${mm}-${dd}`); // formato YYYY-MM-DD
      }

      this.chartLabels = dias.map(fecha => {
        const d = new Date(fecha);
        return d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' });
      });

      const conteoPorDia: number[] = dias.map(fechaStr => {
        return tareas.filter(tarea => {
          if (!tarea.estado) return false;

          const fechaLimite = new Date(tarea.fechaLimite);
          const yyyy = fechaLimite.getFullYear();
          const mm = (fechaLimite.getMonth() + 1).toString().padStart(2, '0');
          const dd = fechaLimite.getDate().toString().padStart(2, '0');
          const tareaFecha = `${yyyy}-${mm}-${dd}`;

          return tareaFecha === fechaStr;
        }).length;
      });

      console.log('Datos para el gráfico:', conteoPorDia);
      console.log('chartLabels:', this.chartLabels);

      this.chartData = {
        labels: this.chartLabels,
        datasets: [{
          label: 'Tareas completadas',
          data: conteoPorDia,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderRadius: 5
        }]
      };
    });
  }
}
