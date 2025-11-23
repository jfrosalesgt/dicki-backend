import { ITipoIndicioRepository } from '../../domain/interfaces/ITipoIndicioRepository';
import { TipoIndicioRepository } from '../../infrastructure/repositories/TipoIndicioRepository';
import { CreateTipoIndicioDTO, UpdateTipoIndicioDTO, TipoIndicioFilters } from '../../domain/entities/TipoIndicio';
import { ApiError } from '../../shared/utils/ApiError';

export class TipoIndicioService {
  private tipoIndicioRepository: ITipoIndicioRepository;

  constructor() {
    this.tipoIndicioRepository = new TipoIndicioRepository();
  }

  async getAllTiposIndicio(filters?: TipoIndicioFilters) {
    return await this.tipoIndicioRepository.findAll(filters);
  }

  async getTipoIndicioById(id: number) {
    const tipoIndicio = await this.tipoIndicioRepository.findById(id);
    if (!tipoIndicio) {
      throw new ApiError(404, 'Tipo de indicio no encontrado');
    }
    return tipoIndicio;
  }

  async createTipoIndicio(dto: CreateTipoIndicioDTO) {
    return await this.tipoIndicioRepository.create(dto);
  }

  async updateTipoIndicio(id: number, dto: UpdateTipoIndicioDTO) {
    const tipoIndicio = await this.tipoIndicioRepository.findById(id);
    if (!tipoIndicio) {
      throw new ApiError(404, 'Tipo de indicio no encontrado');
    }

    await this.tipoIndicioRepository.update(id, dto);
    return await this.tipoIndicioRepository.findById(id);
  }

  async deleteTipoIndicio(id: number, usuario: string) {
    const tipoIndicio = await this.tipoIndicioRepository.findById(id);
    if (!tipoIndicio) {
      throw new ApiError(404, 'Tipo de indicio no encontrado');
    }

    await this.tipoIndicioRepository.delete(id, usuario);
  }
}
