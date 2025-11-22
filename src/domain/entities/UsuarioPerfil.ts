export interface UsuarioPerfil {
  id_usuario_perfil: number;
  id_usuario: number;
  id_perfil: number;
  fecha_inicio: Date;
  fecha_fin?: Date;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
}

export interface CreateUsuarioPerfilDTO {
  id_usuario: number;
  id_perfil: number;
  fecha_inicio?: Date;
  usuario_creacion: string;
}
