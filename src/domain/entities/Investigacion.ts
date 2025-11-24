export interface Investigacion {
  id_investigacion: number;
  codigo_caso: string;
  nombre_caso: string;
  fecha_inicio: Date;
  id_fiscalia: number;
  descripcion_hechos?: string;
  estado_revision_dicri: string;
  id_usuario_registro: number;
  id_usuario_revision?: number;
  justificacion_revision?: string;
  fecha_revision?: Date;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
  nombre_fiscalia?: string;
}

export interface CreateInvestigacionDTO {
  codigo_caso: string;
  nombre_caso: string;
  fecha_inicio: Date;
  id_fiscalia: number;
  id_usuario_registro: number;
  descripcion_hechos?: string;
  usuario_creacion: string;
}

export interface UpdateInvestigacionDTO {
  nombre_caso?: string;
  fecha_inicio?: Date;
  id_fiscalia?: number;
  descripcion_hechos?: string;
  activo?: boolean;
  usuario_actualizacion: string;
}

export interface InvestigacionFilters {
  activo?: boolean;
  estado_revision?: string;
  id_usuario_registro?: number;
  id_fiscalia?: number;
}
