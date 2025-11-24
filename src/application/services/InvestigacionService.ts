import { IInvestigacionRepository } from '../../domain/interfaces/IInvestigacionRepository';
import { CreateInvestigacionDTO, UpdateInvestigacionDTO, Investigacion, InvestigacionFilters } from '../../domain/entities/Investigacion';
import { ApiError } from '../../shared/utils/ApiError';

export class InvestigacionService {
  constructor(private investigacionRepository: IInvestigacionRepository) {}

  async getInvestigacionById(id: number): Promise<Investigacion> {
    const investigacion = await this.investigacionRepository.findById(id);
    
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    return investigacion;
  }

  async createInvestigacion(investigacionData: CreateInvestigacionDTO): Promise<Investigacion> {
    return await this.investigacionRepository.create(investigacionData);
  }

  async updateInvestigacion(id: number, investigacionData: UpdateInvestigacionDTO): Promise<void> {
    await this.getInvestigacionById(id);
    await this.investigacionRepository.update(id, investigacionData);
  }

  async deleteInvestigacion(id: number, usuario_actualizacion: string): Promise<void> {
    await this.getInvestigacionById(id);
    await this.investigacionRepository.delete(id, usuario_actualizacion);
  }

  async getAllInvestigaciones(filters?: InvestigacionFilters): Promise<Investigacion[]> {
    return await this.investigacionRepository.findAll(filters);
  }

  async sendToReview(id: number, usuario_envio: string): Promise<void> {
    const investigacion = await this.getInvestigacionById(id);
    
    if (!['EN_REGISTRO', 'RECHAZADO'].includes(investigacion.estado_revision_dicri)) {
      throw ApiError.badRequest('El expediente debe estar en estado EN_REGISTRO o RECHAZADO para enviarse a revisión');
    }

    await this.investigacionRepository.sendToReview(id, usuario_envio);
  }

  async approveInvestigacion(id: number, id_usuario_coordinador: number, usuario_actualizacion: string): Promise<void> {
    const investigacion = await this.getInvestigacionById(id);
    
    if (!['PENDIENTE_REVISION', 'RECHAZADO'].includes(investigacion.estado_revision_dicri)) {
      throw ApiError.badRequest('El expediente debe estar en estado PENDIENTE_REVISION o RECHAZADO para aprobarse');
    }

    await this.investigacionRepository.approve(id, id_usuario_coordinador, usuario_actualizacion);
  }

  async rejectInvestigacion(id: number, id_usuario_coordinador: number, justificacion: string, usuario_actualizacion: string): Promise<void> {
    const investigacion = await this.getInvestigacionById(id);
    
    if (investigacion.estado_revision_dicri !== 'PENDIENTE_REVISION') {
      throw ApiError.badRequest('El expediente debe estar en estado PENDIENTE_REVISION para rechazarse');
    }

    if (!justificacion || justificacion.trim() === '') {
      throw ApiError.badRequest('La justificación de rechazo es obligatoria');
    }

    await this.investigacionRepository.reject(id, id_usuario_coordinador, justificacion, usuario_actualizacion);
  }
}
