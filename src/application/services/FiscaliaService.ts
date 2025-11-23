import { IFiscaliaRepository } from '../../domain/interfaces/IFiscaliaRepository';
import { FiscaliaRepository } from '../../infrastructure/repositories/FiscaliaRepository';
import { CreateFiscaliaDTO, UpdateFiscaliaDTO, FiscaliaFilters } from '../../domain/entities/Fiscalia';
import { ApiError } from '../../shared/utils/ApiError';

export class FiscaliaService {
  private fiscaliaRepository: IFiscaliaRepository;

  constructor() {
    this.fiscaliaRepository = new FiscaliaRepository();
  }

  async getAllFiscalias(filters?: FiscaliaFilters) {
    return await this.fiscaliaRepository.findAll(filters);
  }

  async getFiscaliaById(id: number) {
    const fiscalia = await this.fiscaliaRepository.findById(id);
    if (!fiscalia) {
      throw new ApiError(404, 'Fiscalía no encontrada');
    }
    return fiscalia;
  }

  async createFiscalia(dto: CreateFiscaliaDTO) {
    return await this.fiscaliaRepository.create(dto);
  }

  async updateFiscalia(id: number, dto: UpdateFiscaliaDTO) {
    const fiscalia = await this.fiscaliaRepository.findById(id);
    if (!fiscalia) {
      throw new ApiError(404, 'Fiscalía no encontrada');
    }

    await this.fiscaliaRepository.update(id, dto);
    return await this.fiscaliaRepository.findById(id);
  }

  async deleteFiscalia(id: number, usuario: string) {
    const fiscalia = await this.fiscaliaRepository.findById(id);
    if (!fiscalia) {
      throw new ApiError(404, 'Fiscalía no encontrada');
    }

    await this.fiscaliaRepository.delete(id, usuario);
  }
}
