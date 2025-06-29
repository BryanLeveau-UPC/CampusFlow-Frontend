export interface Recurso {
  idRecurso?: number;
  tipoArchivo: string;
  url: string;
  fechaSubida: Date; 
  id_tarea: number; 
  id_publicacion: number; 
  Estado: boolean;
}
