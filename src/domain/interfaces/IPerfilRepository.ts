import { Perfil, CreatePerfilDTO, UpdatePerfilDTO } from '../entities/Perfil';

export interface IPerfilRepository {
  findById(id: number): Promise<Perfil | null>;
  findByName(nombre: string): Promise<Perfil | null>;
  create(perfil: CreatePerfilDTO): Promise<Perfil>;
  update(id: number, perfil: UpdatePerfilDTO): Promise<void>;
  findAll(activo?: boolean): Promise<Perfil[]>;
  findByUsuario(idUsuario: number): Promise<Perfil[]>;
}
