export interface Evento {
  IdEvento?: number;
  Nombre: string;
  FechaInicio: string;
  FechaFin: string;   
  Descripcion: string;
  PuntajeRecompensa: number;
  idProfesor: number; 
  Estado: boolean;
}