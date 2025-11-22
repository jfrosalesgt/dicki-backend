export interface Escena {
  id_escena: number;
  id_investigacion: number;
  nombre_escena: string;
  direccion_escena: string;
  fecha_hora_inicio: Date;
  fecha_hora_fin?: Date;
  descripcion?: string;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
}

export interface CreateEscenaDTO {
  id_investigacion: number;
  nombre_escena: string;
  direccion_escena: string;
  fecha_hora_inicio: Date;
  fecha_hora_fin?: Date;
  descripcion?: string;
  usuario_creacion: string;
}

export interface UpdateEscenaDTO {
  nombre_escena?: string;
  direccion_escena?: string;
  fecha_hora_inicio?: Date;
  fecha_hora_fin?: Date;
  descripcion?: string;
  usuario_actualizacion: string;
}
