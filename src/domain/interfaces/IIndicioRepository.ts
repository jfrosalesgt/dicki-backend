import { Indicio, CreateIndicioDTO, UpdateIndicioDTO, IndicioFilters } from '../entities/Indicio';

export interface IIndicioRepository {
  findById(id: number): Promise<Indicio | null>;
  create(indicio: CreateIndicioDTO): Promise<Indicio>;
  update(id: number, indicio: UpdateIndicioDTO): Promise<void>;
  delete(id: number, usuario_actualizacion: string): Promise<void>;
  findAll(filters?: IndicioFilters): Promise<Indicio[]>;
  findByEscena(idEscena: number): Promise<Indicio[]>;
}
