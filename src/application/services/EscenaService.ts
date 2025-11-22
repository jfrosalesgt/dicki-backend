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
    // Verificar que el expediente existe
    const investigacion = await this.investigacionRepository.findById(escenaData.id_investigacion);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    // Verificar que el expediente no esté aprobado
    if (investigacion.estado_revision_dicri === 'APROBADO') {
      throw ApiError.badRequest('No se pueden agregar escenas a un expediente aprobado');
    }

    return await this.escenaRepository.create(escenaData);
  }

  async updateEscena(id: number, escenaData: UpdateEscenaDTO): Promise<void> {
    // Verificar que existe
    const escena = await this.getEscenaById(id);
    
    // Verificar que el expediente no esté aprobado
    const investigacion = await this.investigacionRepository.findById(escena.id_investigacion);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    if (investigacion.estado_revision_dicri === 'APROBADO') {
      throw ApiError.badRequest('No se pueden modificar escenas de un expediente aprobado');
    }

    await this.escenaRepository.update(id, escenaData);
  }

  async deleteEscena(id: number, usuario_actualizacion: string): Promise<void> {
    // Verificar que existe
    const escena = await this.getEscenaById(id);
    
    // Verificar que el expediente no esté aprobado
    const investigacion = await this.investigacionRepository.findById(escena.id_investigacion);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    if (investigacion.estado_revision_dicri === 'APROBADO') {
      throw ApiError.badRequest('No se pueden eliminar escenas de un expediente aprobado');
    }

    await this.escenaRepository.delete(id, usuario_actualizacion);
  }

  async getEscenasByExpediente(idExpediente: number): Promise<Escena[]> {
    // Verificar que el expediente existe
    const investigacion = await this.investigacionRepository.findById(idExpediente);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    return await this.escenaRepository.findByInvestigacion(idExpediente);
  }
}
