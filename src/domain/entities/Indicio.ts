export interface Indicio {
  id_indicio: number;
  codigo_indicio: string;
  id_escena: number;
  id_tipo_indicio: number;
  descripcion_corta: string;
  ubicacion_especifica?: string;
  fecha_hora_recoleccion: Date;
  id_usuario_recolector: number;
  estado_actual: string;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
  nombre_escena?: string;
  nombre_tipo?: string;
  nombre_recolector?: string;
}

export interface CreateIndicioDTO {
  codigo_indicio: string;
  id_escena: number;
  id_tipo_indicio: number;
  descripcion_corta: string;
  ubicacion_especifica?: string;
  fecha_hora_recoleccion: Date;
  id_usuario_recolector: number;
  usuario_creacion: string;
}

export interface UpdateIndicioDTO {
  descripcion_corta?: string;
  ubicacion_especifica?: string;
  fecha_hora_recoleccion?: Date;
  id_tipo_indicio?: number;
  estado_actual?: string;
  usuario_actualizacion: string;
}

export interface IndicioFilters {
  activo?: boolean;
  id_escena?: number;
  id_tipo_indicio?: number;
  estado_actual?: string;
}
