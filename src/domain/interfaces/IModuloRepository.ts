import { Modulo, CreateModuloDTO, UpdateModuloDTO } from '../entities/Modulo';

export interface IModuloRepository {
  findById(id: number): Promise<Modulo | null>;
  create(modulo: CreateModuloDTO): Promise<Modulo>;
  update(id: number, modulo: UpdateModuloDTO): Promise<void>;
  findAll(activo?: boolean): Promise<Modulo[]>;
  findByPerfil(idPerfil: number): Promise<Modulo[]>;
  findByUsuario(idUsuario: number): Promise<Modulo[]>;
}
