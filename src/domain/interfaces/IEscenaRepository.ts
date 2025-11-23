import { Escena, CreateEscenaDTO, UpdateEscenaDTO } from '../entities/Escena';

export interface IEscenaRepository {
  findById(id: number): Promise<Escena | null>;
  create(escena: CreateEscenaDTO): Promise<Escena>;
  update(id: number, escena: UpdateEscenaDTO): Promise<void>;
  delete(id: number, usuario_actualizacion: string): Promise<void>;
  findByInvestigacion(idInvestigacion: number): Promise<Escena[]>;
}
