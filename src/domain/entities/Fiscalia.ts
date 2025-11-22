export interface Fiscalia {
  id_fiscalia: number;
  nombre_fiscalia: string;
  direccion?: string;
  telefono?: string;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
}

export interface CreateFiscaliaDTO {
  nombre_fiscalia: string;
  direccion?: string;
  telefono?: string;
  usuario_creacion: string;
}

export interface UpdateFiscaliaDTO {
  nombre_fiscalia?: string;
  direccion?: string;
  telefono?: string;
  activo?: boolean;
  usuario_actualizacion: string;
}

export interface FiscaliaFilters {
  activo?: boolean;
}
