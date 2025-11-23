import { InvestigacionService } from '../../application/services/InvestigacionService';
import { IInvestigacionRepository } from '../../domain/interfaces/IInvestigacionRepository';
import { CreateInvestigacionDTO, Investigacion } from '../../domain/entities/Investigacion';

describe('InvestigacionService', () => {
  let investigacionService: InvestigacionService;
  let mockInvestigacionRepository: jest.Mocked<IInvestigacionRepository>;

  beforeEach(() => {
    mockInvestigacionRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      sendToReview: jest.fn(),
      approve: jest.fn(),
      reject: jest.fn(),
    } as any;

    investigacionService = new InvestigacionService(mockInvestigacionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvestigacion', () => {
    it('debería crear un expediente exitosamente', async () => {
      // Arrange
      const createData: CreateInvestigacionDTO = {
        codigo_caso: 'DICRI-001-2025-1001',
        nombre_caso: 'Homicidio en Zona 10',
        fecha_inicio: new Date('2025-11-20'),
        id_fiscalia: 1,
        descripcion_hechos: 'Descripción del caso',
        id_usuario_registro: 2,
        usuario_creacion: 'tec_1',
      };

      const mockInvestigacion: Investigacion = {
        id_investigacion: 1,
        ...createData,
        fecha_inicio: new Date('2025-11-20'),
        estado_revision_dicri: 'EN_REGISTRO',
        activo: true,
        fecha_creacion: new Date(),
      };

      mockInvestigacionRepository.create.mockResolvedValue(mockInvestigacion);

      // Act
      const result = await investigacionService.createInvestigacion(createData);

      // Assert
      expect(result.id_investigacion).toBe(1);
      expect(result.codigo_caso).toBe('DICRI-001-2025-1001');
      expect(result.estado_revision_dicri).toBe('EN_REGISTRO');
    });
  });

  describe('sendToReview', () => {
    it('debería enviar expediente a revisión desde EN_REGISTRO', async () => {
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

      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);
      mockInvestigacionRepository.sendToReview.mockResolvedValue();

      // Act
      await investigacionService.sendToReview(1, 'tec_1');

      // Assert
      expect(mockInvestigacionRepository.sendToReview).toHaveBeenCalledWith(1, 'tec_1');
    });

    it('debería enviar expediente a revisión desde RECHAZADO', async () => {
      // Arrange
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

      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);
      mockInvestigacionRepository.sendToReview.mockResolvedValue();

      // Act
      await investigacionService.sendToReview(1, 'tec_1');

      // Assert
      expect(mockInvestigacionRepository.sendToReview).toHaveBeenCalledWith(1, 'tec_1');
    });

    it('debería lanzar error si el expediente está APROBADO', async () => {
      // Arrange
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
      await expect(investigacionService.sendToReview(1, 'tec_1')).rejects.toThrow(
        'El expediente debe estar en estado EN_REGISTRO o RECHAZADO para enviarse a revisión'
      );
    });
  });

  describe('approveInvestigacion', () => {
    it('debería aprobar expediente desde PENDIENTE_REVISION', async () => {
      // Arrange
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

      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);
      mockInvestigacionRepository.approve.mockResolvedValue();

      // Act
      await investigacionService.approveInvestigacion(1, 3, 'coord_1');

      // Assert
      expect(mockInvestigacionRepository.approve).toHaveBeenCalledWith(1, 3, 'coord_1');
    });

    it('debería lanzar error si el expediente NO está en PENDIENTE_REVISION', async () => {
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

      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);

      // Act & Assert
      await expect(
        investigacionService.approveInvestigacion(1, 3, 'coord_1')
      ).rejects.toThrow(
        'El expediente debe estar en estado PENDIENTE_REVISION o RECHAZADO para aprobarse'
      );
    });
  });

  describe('rejectInvestigacion', () => {
    it('debería rechazar expediente con justificación válida', async () => {
      // Arrange
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

      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);
      mockInvestigacionRepository.reject.mockResolvedValue();

      // Act
      await investigacionService.rejectInvestigacion(
        1,
        3,
        'Faltan campos de metadatos',
        'coord_1'
      );

      // Assert
      expect(mockInvestigacionRepository.reject).toHaveBeenCalledWith(
        1,
        3,
        'Faltan campos de metadatos',
        'coord_1'
      );
    });

    it('debería lanzar error si NO hay justificación', async () => {
      // Arrange
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

      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);

      // Act & Assert
      await expect(
        investigacionService.rejectInvestigacion(1, 3, '', 'coord_1')
      ).rejects.toThrow('La justificación de rechazo es obligatoria');
    });

    it('debería lanzar error si el expediente NO está en PENDIENTE_REVISION', async () => {
      // Arrange
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
      await expect(
        investigacionService.rejectInvestigacion(1, 3, 'Justificación', 'coord_1')
      ).rejects.toThrow(
        'El expediente debe estar en estado PENDIENTE_REVISION para rechazarse'
      );
    });
  });

  describe('deleteInvestigacion', () => {
    it('debería eliminar expediente exitosamente', async () => {
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

      mockInvestigacionRepository.findById.mockResolvedValue(mockInvestigacion);
      mockInvestigacionRepository.delete.mockResolvedValue();

      // Act
      await investigacionService.deleteInvestigacion(1, 'admin');

      // Assert
      expect(mockInvestigacionRepository.delete).toHaveBeenCalledWith(1, 'admin');
    });

    it('debería lanzar error si el expediente no existe', async () => {
      // Arrange
      mockInvestigacionRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(investigacionService.deleteInvestigacion(999, 'admin')).rejects.toThrow(
        'Expediente no encontrado'
      );
    });
  });
});
