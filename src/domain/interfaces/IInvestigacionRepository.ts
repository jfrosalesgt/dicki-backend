import { Investigacion, CreateInvestigacionDTO, UpdateInvestigacionDTO, InvestigacionFilters } from '../entities/Investigacion';

export interface IInvestigacionRepository {
  findById(id: number): Promise<Investigacion | null>;
  create(investigacion: CreateInvestigacionDTO): Promise<Investigacion>;
  update(id: number, investigacion: UpdateInvestigacionDTO): Promise<void>;
  delete(id: number, usuario_actualizacion: string): Promise<void>;
  findAll(filters?: InvestigacionFilters): Promise<Investigacion[]>;
  sendToReview(id: number, usuario_envio: string): Promise<void>;
  approve(id: number, id_usuario_coordinador: number, usuario_actualizacion: string): Promise<void>;
  reject(id: number, id_usuario_coordinador: number, justificacion: string, usuario_actualizacion: string): Promise<void>;
}
