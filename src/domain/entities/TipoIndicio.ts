export interface TipoIndicio {
  id_tipo_indicio: number;
  nombre_tipo: string;
  descripcion?: string;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
}

export interface CreateTipoIndicioDTO {
  nombre_tipo: string;
  descripcion?: string;
  usuario_creacion: string;
}

export interface UpdateTipoIndicioDTO {
  nombre_tipo?: string;
  descripcion?: string;
  activo?: boolean;
  usuario_actualizacion: string;
}

export interface TipoIndicioFilters {
  activo?: boolean;
}
