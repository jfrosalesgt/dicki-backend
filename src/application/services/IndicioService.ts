import { IIndicioRepository } from '../../domain/interfaces/IIndicioRepository';
import { IEscenaRepository } from '../../domain/interfaces/IEscenaRepository';
import { IInvestigacionRepository } from '../../domain/interfaces/IInvestigacionRepository';
import { CreateIndicioDTO, UpdateIndicioDTO, Indicio, IndicioFilters } from '../../domain/entities/Indicio';
import { ApiError } from '../../shared/utils/ApiError';

export class IndicioService {
  constructor(
    private indicioRepository: IIndicioRepository,
    private escenaRepository: IEscenaRepository,
    private investigacionRepository: IInvestigacionRepository
  ) {}

  async getIndicioById(id: number): Promise<Indicio> {
    const indicio = await this.indicioRepository.findById(id);
    
    if (!indicio) {
      throw ApiError.notFound('Indicio no encontrado');
    }

    return indicio;
  }

  async createIndicio(indicioData: CreateIndicioDTO, idUsuario: number): Promise<Indicio> {
    // Verificar que la escena existe
    const escena = await this.escenaRepository.findById(indicioData.id_escena);
    if (!escena) {
      throw ApiError.notFound('Escena no encontrada');
    }

    // Verificar que el expediente asociado no esté aprobado
    const investigacion = await this.investigacionRepository.findById(escena.id_investigacion);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    if (investigacion.estado_revision_dicri === 'APROBADO') {
      throw ApiError.badRequest('No se pueden agregar indicios a un expediente aprobado');
    }

    // Agregar el ID del usuario recolector
    const indicioConRecolector = {
      ...indicioData,
      id_usuario_recolector: idUsuario,
    };

    return await this.indicioRepository.create({
      ...indicioConRecolector,
      fecha_hora_recoleccion: indicioConRecolector.fecha_hora_recoleccion || new Date(),
    } as any);
  }

  async updateIndicio(id: number, indicioData: UpdateIndicioDTO): Promise<void> {
    // Verificar que existe
    const indicio = await this.getIndicioById(id);
    
    // Verificar que la escena existe y obtener el expediente
    const escena = await this.escenaRepository.findById(indicio.id_escena);
    if (!escena) {
      throw ApiError.notFound('Escena no encontrada');
    }

    // Verificar que el expediente no esté aprobado
    const investigacion = await this.investigacionRepository.findById(escena.id_investigacion);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    if (investigacion.estado_revision_dicri === 'APROBADO') {
      throw ApiError.badRequest('No se pueden modificar indicios de un expediente aprobado');
    }

    await this.indicioRepository.update(id, indicioData);
  }

  async deleteIndicio(id: number, usuario_actualizacion: string): Promise<void> {
    // Verificar que existe
    const indicio = await this.getIndicioById(id);
    
    // Verificar que la escena existe y obtener el expediente
    const escena = await this.escenaRepository.findById(indicio.id_escena);
    if (!escena) {
      throw ApiError.notFound('Escena no encontrada');
    }

    // Verificar que el expediente no esté aprobado
    const investigacion = await this.investigacionRepository.findById(escena.id_investigacion);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    if (investigacion.estado_revision_dicri === 'APROBADO') {
      throw ApiError.badRequest('No se pueden eliminar indicios de un expediente aprobado');
    }

    await this.indicioRepository.delete(id, usuario_actualizacion);
  }

  async getAllIndicios(filters?: IndicioFilters): Promise<Indicio[]> {
    return await this.indicioRepository.findAll(filters);
  }

  async getIndiciosByExpediente(idExpediente: number): Promise<Indicio[]> {
    // Verificar que el expediente existe
    const investigacion = await this.investigacionRepository.findById(idExpediente);
    if (!investigacion) {
      throw ApiError.notFound('Expediente no encontrado');
    }

    // Obtener todas las escenas del expediente
    const escenas = await this.escenaRepository.findByInvestigacion(idExpediente);
    
    // Obtener indicios de todas las escenas
    const indiciosPorEscena = await Promise.all(
      escenas.map(escena => this.indicioRepository.findByEscena(escena.id_escena))
    );

    // Aplanar el array de arrays
    return indiciosPorEscena.flat();
  }

  async getIndiciosByEscena(idEscena: number): Promise<Indicio[]> {
    // Verificar que la escena existe
    const escena = await this.escenaRepository.findById(idEscena);
    if (!escena) {
      throw ApiError.notFound('Escena no encontrada');
    }

    return await this.indicioRepository.findByEscena(idEscena);
  }
}
