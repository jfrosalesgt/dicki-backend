export interface Role {
  id_role: number;
  nombre_role: string;
  descripcion?: string;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
}

export interface CreateRoleDTO {
  nombre_role: string;
  descripcion?: string;
  usuario_creacion: string;
}

export interface UpdateRoleDTO {
  nombre_role?: string;
  descripcion?: string;
  activo?: boolean;
  usuario_actualizacion: string;
}
