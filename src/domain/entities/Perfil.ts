export interface Perfil {
  id_perfil: number;
  nombre_perfil: string;
  descripcion?: string;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
}

export interface CreatePerfilDTO {
  nombre_perfil: string;
  descripcion?: string;
  usuario_creacion: string;
}

export interface UpdatePerfilDTO {
  nombre_perfil?: string;
  descripcion?: string;
  activo?: boolean;
  usuario_actualizacion: string;
}
