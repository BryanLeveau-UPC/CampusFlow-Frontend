export interface Publicacion {
  IdPublicacion?: number;
  Contenido: string;
  Fecha: Date; 
  label: string;
  idGrupoForo: number;
  Estado: boolean;
}