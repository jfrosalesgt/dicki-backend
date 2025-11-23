import { EscenaService } from '../../application/services/EscenaService';
import { IEscenaRepository } from '../../domain/interfaces/IEscenaRepository';
import { IInvestigacionRepository } from '../../domain/interfaces/IInvestigacionRepository';
import { CreateEscenaDTO, Escena } from '../../domain/entities/Escena';
import { Investigacion } from '../../domain/entities/Investigacion';

describe('EscenaService', () => {
  let escenaService: EscenaService;
  let mockEscenaRepository: jest.Mocked<IEscenaRepository>;
  let mockInvestigacionRepository: jest.Mocked<IInvestigacionRepository>;

  beforeEach(() => {
    mockEscenaRepository = {
      findById: jest.fn(),
      findByInvestigacion: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockInvestigacionRepository = {
      findById: jest.fn(),
    } as any;

    escenaService = new EscenaService(mockEscenaRepository, mockInvestigacionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEscena', () => {
    it('debería crear una escena exitosamente cuando el expediente está EN_REGISTRO', async () => {
      // Arrange
      const createData: CreateEscenaDTO = {
        id_investigacion: 1,
        nombre_escena: 'Escena Principal',
        direccion_escena: 'Ciudad de Guatemala',
        fecha_hora_inicio: new Date('2025-11-20T08:00:00Z'),
        descripcion: 'Descripción de la escena',
        usuario_creacion: 'tec_1',
      };

      const mockInvestigacion: Investigacion = {
        id_investigacion: 1,
        codigo_caso: 'DICRI-001-2025-1001',
        nombre_caso: 'Homicidio',
        fecha_inicio: new Date(),
        id_fiscalia: 1,
        id_usuario_registro: 2,
        estado_revision_dicri: 'EN_REGISTRO',
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      const mockEscena: Escena = {
        id_escena: 1,
        ...createData,
        fecha_hora_inicio: new Date('2025-11-20T08:00:00Z'),
        activo: true,
        fecha_creacion: new Date(),
      };

      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);
      mockEscenaRepository.create.mockResolvedValue(mockEscena);

      // Act
      const result = await escenaService.createEscena(createData);

      // Assert
      expect(result.id_escena).toBe(1);
      expect(result.nombre_escena).toBe('Escena Principal');
      expect(mockEscenaRepository.create).toHaveBeenCalledWith(createData);
    });

    it('debería lanzar error si el expediente no existe', async () => {
      // Arrange
      const createData: CreateEscenaDTO = {
        id_investigacion: 999,
        nombre_escena: 'Escena Principal',
        direccion_escena: 'Ciudad de Guatemala',
        fecha_hora_inicio: new Date('2025-11-20T08:00:00Z'),
        usuario_creacion: 'tec_1',
      };

      mockInvestigacionRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(escenaService.createEscena(createData)).rejects.toThrow(
        'Expediente no encontrado'
      );
    });

    it('debería lanzar error si el expediente está APROBADO', async () => {
      // Arrange
      const createData: CreateEscenaDTO = {
        id_investigacion: 1,
        nombre_escena: 'Escena Principal',
        direccion_escena: 'Ciudad de Guatemala',
        fecha_hora_inicio: new Date('2025-11-20T08:00:00Z'),
        usuario_creacion: 'tec_1',
      };

      const mockInvestigacion: Investigacion = {
        id_investigacion: 1,
        codigo_caso: 'DICRI-001-2025-1001',
        nombre_caso: 'Homicidio',
        fecha_inicio: new Date(),
        id_fiscalia: 1,
        id_usuario_registro: 2,
        estado_revision_dicri: 'APROBADO',
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);

      // Act & Assert
      await expect(escenaService.createEscena(createData)).rejects.toThrow(
        'No se pueden agregar escenas a un expediente aprobado'
      );
    });
  });

  describe('updateEscena', () => {
    it('debería actualizar una escena cuando el expediente está EN_REGISTRO', async () => {
      // Arrange
      const mockEscena: Escena = {
        id_escena: 1,
        id_investigacion: 1,
        nombre_escena: 'Escena Principal',
        direccion_escena: 'Ciudad de Guatemala',
        fecha_hora_inicio: new Date(),
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      const mockInvestigacion: Investigacion = {
        id_investigacion: 1,
        codigo_caso: 'DICRI-001-2025-1001',
        nombre_caso: 'Homicidio',
        fecha_inicio: new Date(),
        id_fiscalia: 1,
        id_usuario_registro: 2,
        estado_revision_dicri: 'EN_REGISTRO',
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      mockEscenaRepository.findById.mockResolvedValue(mockEscena);
      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);
      mockEscenaRepository.update.mockResolvedValue();

      // Act
      await escenaService.updateEscena(1, {
        nombre_escena: 'Escena Actualizada',
        usuario_actualizacion: 'tec_1',
      });

      // Assert
      expect(mockEscenaRepository.update).toHaveBeenCalledWith(1, {
        nombre_escena: 'Escena Actualizada',
        usuario_actualizacion: 'tec_1',
      });
    });

    it('debería actualizar una escena cuando el expediente está RECHAZADO', async () => {
      // Arrange
      const mockEscena: Escena = {
        id_escena: 1,
        id_investigacion: 1,
        nombre_escena: 'Escena Principal',
        direccion_escena: 'Ciudad de Guatemala',
        fecha_hora_inicio: new Date(),
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      const mockInvestigacion: Investigacion = {
        id_investigacion: 1,
        codigo_caso: 'DICRI-001-2025-1001',
        nombre_caso: 'Homicidio',
        fecha_inicio: new Date(),
        id_fiscalia: 1,
        id_usuario_registro: 2,
        estado_revision_dicri: 'RECHAZADO',
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      mockEscenaRepository.findById.mockResolvedValue(mockEscena);
      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);
      mockEscenaRepository.update.mockResolvedValue();

      // Act
      await escenaService.updateEscena(1, {
        nombre_escena: 'Escena Actualizada',
        usuario_actualizacion: 'tec_1',
      });

      // Assert
      expect(mockEscenaRepository.update).toHaveBeenCalled();
    });

    it('debería lanzar error si el expediente está APROBADO', async () => {
      // Arrange
      const mockEscena: Escena = {
        id_escena: 1,
        id_investigacion: 1,
        nombre_escena: 'Escena Principal',
        direccion_escena: 'Ciudad de Guatemala',
        fecha_hora_inicio: new Date(),
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      const mockInvestigacion: Investigacion = {
        id_investigacion: 1,
        codigo_caso: 'DICRI-001-2025-1001',
        nombre_caso: 'Homicidio',
        fecha_inicio: new Date(),
        id_fiscalia: 1,
        id_usuario_registro: 2,
        estado_revision_dicri: 'APROBADO',
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      mockEscenaRepository.findById.mockResolvedValue(mockEscena);
      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);

      // Act & Assert
      await expect(
        escenaService.updateEscena(1, {
          nombre_escena: 'Escena Actualizada',
          usuario_actualizacion: 'tec_1',
        })
      ).rejects.toThrow(
        'No se pueden modificar escenas de un expediente en estado APROBADO'
      );
    });
  });

  describe('deleteEscena', () => {
    it('debería eliminar una escena cuando el expediente está EN_REGISTRO', async () => {
      // Arrange
      const mockEscena: Escena = {
        id_escena: 1,
        id_investigacion: 1,
        nombre_escena: 'Escena Principal',
        direccion_escena: 'Ciudad de Guatemala',
        fecha_hora_inicio: new Date(),
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      const mockInvestigacion: Investigacion = {
        id_investigacion: 1,
        codigo_caso: 'DICRI-001-2025-1001',
        nombre_caso: 'Homicidio',
        fecha_inicio: new Date(),
        id_fiscalia: 1,
        id_usuario_registro: 2,
        estado_revision_dicri: 'EN_REGISTRO',
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      mockEscenaRepository.findById.mockResolvedValue(mockEscena);
      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);
      mockEscenaRepository.delete.mockResolvedValue();

      // Act
      await escenaService.deleteEscena(1, 'tec_1');

      // Assert
      expect(mockEscenaRepository.delete).toHaveBeenCalledWith(1, 'tec_1');
    });

    it('debería lanzar error si el expediente está PENDIENTE_REVISION', async () => {
      // Arrange
      const mockEscena: Escena = {
        id_escena: 1,
        id_investigacion: 1,
        nombre_escena: 'Escena Principal',
        direccion_escena: 'Ciudad de Guatemala',
        fecha_hora_inicio: new Date(),
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      const mockInvestigacion: Investigacion = {
        id_investigacion: 1,
        codigo_caso: 'DICRI-001-2025-1001',
        nombre_caso: 'Homicidio',
        fecha_inicio: new Date(),
        id_fiscalia: 1,
        id_usuario_registro: 2,
        estado_revision_dicri: 'PENDIENTE_REVISION',
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      mockEscenaRepository.findById.mockResolvedValue(mockEscena);
      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);

      // Act & Assert
      await expect(escenaService.deleteEscena(1, 'tec_1')).rejects.toThrow(
        'No se pueden eliminar escenas de un expediente en estado PENDIENTE_REVISION'
      );
    });
  });

  describe('getEscenasByExpediente', () => {
    it('debería obtener todas las escenas de un expediente', async () => {
      // Arrange
      const mockInvestigacion: Investigacion = {
        id_investigacion: 1,
        codigo_caso: 'DICRI-001-2025-1001',
        nombre_caso: 'Homicidio',
        fecha_inicio: new Date(),
        id_fiscalia: 1,
        id_usuario_registro: 2,
        estado_revision_dicri: 'EN_REGISTRO',
        activo: true,
        usuario_creacion: 'tec_1',
        fecha_creacion: new Date(),
      };

      const mockEscenas: Escena[] = [
        {
          id_escena: 1,
          id_investigacion: 1,
          nombre_escena: 'Escena Principal',
          direccion_escena: 'Ciudad de Guatemala',
          fecha_hora_inicio: new Date(),
          activo: true,
          usuario_creacion: 'tec_1',
          fecha_creacion: new Date(),
        },
        {
          id_escena: 2,
          id_investigacion: 1,
          nombre_escena: 'Escena Secundaria',
          direccion_escena: 'Ciudad de Guatemala',
          fecha_hora_inicio: new Date(),
          activo: true,
          usuario_creacion: 'tec_1',
          fecha_creacion: new Date(),
        },
      ];

      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);
      mockEscenaRepository.findByInvestigacion.mockResolvedValue(mockEscenas);

      // Act
      const result = await escenaService.getEscenasByExpediente(1);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].nombre_escena).toBe('Escena Principal');
      expect(mockEscenaRepository.findByInvestigacion).toHaveBeenCalledWith(1);
    });

    it('debería lanzar error si el expediente no existe', async () => {
      // Arrange
      mockInvestigacionRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(escenaService.getEscenasByExpediente(999)).rejects.toThrow(
        'Expediente no encontrado'
      );
    });
  });
});
