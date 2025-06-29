export interface Nota {
  idNota?: number;
  Tipo: string;
  Puntaje: number;
  Peso_Nota: number;
  id_asignatura: number; 
  Estado: boolean;
  id_estudiante: number; 
}