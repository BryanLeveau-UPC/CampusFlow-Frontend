export interface Nota {
  idNota?: number; 
  tipo: string;
  puntaje: number;
  peso_Nota: number;
  id_asignatura: number;
  nombreAsignatura: string; 
  id_estudiante: number; 
  Estado: boolean;
}