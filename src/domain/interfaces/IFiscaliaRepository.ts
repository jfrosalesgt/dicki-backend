import { Fiscalia, CreateFiscaliaDTO, UpdateFiscaliaDTO, FiscaliaFilters } from '../entities/Fiscalia';

export interface IFiscaliaRepository {
  findAll(filters?: FiscaliaFilters): Promise<Fiscalia[]>;
  findById(id: number): Promise<Fiscalia | null>;
  create(dto: CreateFiscaliaDTO): Promise<Fiscalia>;
  update(id: number, dto: UpdateFiscaliaDTO): Promise<void>;
  delete(id: number, usuario: string): Promise<void>;
}
