export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  clave: string;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  cambiar_clave: boolean;
  intentos_fallidos: number;
  fecha_ultimo_acceso?: Date;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
}

export interface CreateUsuarioDTO {
  nombre_usuario: string;
  clave: string;
  nombre: string;
  apellido: string;
  email: string;
  usuario_creacion: string;
}

export interface UpdateUsuarioDTO {
  nombre?: string;
  apellido?: string;
  email?: string;
  activo?: boolean;
  usuario_actualizacion: string;
}
