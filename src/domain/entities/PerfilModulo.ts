export interface PerfilModulo {
  id_perfil_modulo: number;
  id_perfil: number;
  id_modulo: number;
  puede_leer: boolean;
  puede_crear: boolean;
  puede_editar: boolean;
  puede_eliminar: boolean;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
}

export interface CreatePerfilModuloDTO {
  id_perfil: number;
  id_modulo: number;
  puede_leer?: boolean;
  puede_crear?: boolean;
  puede_editar?: boolean;
  puede_eliminar?: boolean;
  usuario_creacion: string;
}
