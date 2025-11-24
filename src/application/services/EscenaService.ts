import { IEscenaRepository } from '../../domain/interfaces/IEscenaRepository';
import { IInvestigacionRepository } from '../../domain/interfaces/IInvestigacionRepository';
import { CreateEscenaDTO, UpdateEscenaDTO, Escena } from '../../domain/entities/Escena';
import { ApiError } from '../../shared/utils/ApiError';

export class EscenaService {
  constructor(
    private escenaRepository: IEscenaRepository,
    private investigacionRepository: IInvestigacionRepository
  ) {}

  async getEscenaById(id: number): Promise<Escena> {
    const escena = await this.escenaRepository.findById(id);
    
    if (!escena) {
      throw ApiError.notFound('Escena no encontrada');
    }

    return escena;
  }

  async createEscena(escenaData: CreateEscenaDTO): Promise<Escena> {
    const investigacion = await this.investigacionRepository.findById(escenaData.id_investigacion);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    if (investigacion.estado_revision_dicri === 'APROBADO') {
      throw ApiError.badRequest('No se pueden agregar escenas a un expediente aprobado');
    }

    return await this.escenaRepository.create(escenaData);
  }

  async updateEscena(id: number, escenaData: UpdateEscenaDTO): Promise<void> {
    const escena = await this.getEscenaById(id);
    
    const investigacion = await this.investigacionRepository.findById(escena.id_investigacion);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    if (!['EN_REGISTRO', 'RECHAZADO'].includes(investigacion.estado_revision_dicri)) {
      throw ApiError.badRequest(
        `No se pueden modificar escenas de un expediente en estado ${investigacion.estado_revision_dicri}. ` +
        'Solo se permiten modificaciones cuando el expediente está EN_REGISTRO o RECHAZADO'
      );
    }

    await this.escenaRepository.update(id, escenaData);
  }

  async deleteEscena(id: number, usuario_actualizacion: string): Promise<void> {
    const escena = await this.getEscenaById(id);
    
    const investigacion = await this.investigacionRepository.findById(escena.id_investigacion);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    if (!['EN_REGISTRO', 'RECHAZADO'].includes(investigacion.estado_revision_dicri)) {
      throw ApiError.badRequest(
        `No se pueden eliminar escenas de un expediente en estado ${investigacion.estado_revision_dicri}. ` +
        'Solo se permiten eliminaciones cuando el expediente está EN_REGISTRO o RECHAZADO'
      );
    }

    await this.escenaRepository.delete(id, usuario_actualizacion);
  }

  async getEscenasByExpediente(idExpediente: number): Promise<Escena[]> {
    const investigacion = await this.investigacionRepository.findById(idExpediente);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    return await this.escenaRepository.findByInvestigacion(idExpediente);
  }
}
