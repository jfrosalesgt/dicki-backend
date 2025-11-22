import { Role, CreateRoleDTO, UpdateRoleDTO } from '../entities/Role';

export interface IRoleRepository {
  findById(id: number): Promise<Role | null>;
  findByName(nombre: string): Promise<Role | null>;
  create(role: CreateRoleDTO): Promise<Role>;
  update(id: number, role: UpdateRoleDTO): Promise<void>;
  findAll(activo?: boolean): Promise<Role[]>;
  findByUsuario(idUsuario: number): Promise<Role[]>;
}
