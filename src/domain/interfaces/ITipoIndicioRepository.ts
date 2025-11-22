import { TipoIndicio, CreateTipoIndicioDTO, UpdateTipoIndicioDTO, TipoIndicioFilters } from '../entities/TipoIndicio';

export interface ITipoIndicioRepository {
  findAll(filters?: TipoIndicioFilters): Promise<TipoIndicio[]>;
  findById(id: number): Promise<TipoIndicio | null>;
  create(dto: CreateTipoIndicioDTO): Promise<TipoIndicio>;
  update(id: number, dto: UpdateTipoIndicioDTO): Promise<void>;
  delete(id: number, usuario: string): Promise<void>;
}
