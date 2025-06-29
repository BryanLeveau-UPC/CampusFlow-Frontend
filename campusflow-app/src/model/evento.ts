export interface Evento {
  IdEvento?: number;
  Nombre: string;
  FechaInicio: Date;
  FechaFin: Date;    
  Descripcion: string;
  PuntajeRecompensa: number;
  idProfesor: number;
  Estado: boolean;
}