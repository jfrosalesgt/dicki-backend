export interface Modulo {
  id_modulo: number;
  nombre_modulo: string;
  descripcion?: string;
  ruta?: string;
  icono?: string;
  orden: number;
  id_modulo_padre?: number;
  activo: boolean;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_actualizacion?: string;
  fecha_actualizacion?: Date;
}

export interface CreateModuloDTO {
  nombre_modulo: string;
  descripcion?: string;
  ruta?: string;
  icono?: string;
  orden?: number;
  id_modulo_padre?: number;
  usuario_creacion: string;
}

export interface UpdateModuloDTO {
  nombre_modulo?: string;
  descripcion?: string;
  ruta?: string;
  icono?: string;
  orden?: number;
  id_modulo_padre?: number;
  activo?: boolean;
  usuario_actualizacion: string;
}
