import { FiscaliaService } from '../../application/services/FiscaliaService';
import { IFiscaliaRepository } from '../../domain/interfaces/IFiscaliaRepository';
import { CreateFiscaliaDTO, Fiscalia } from '../../domain/entities/Fiscalia';

// Mock del repositorio
jest.mock('../../infrastructure/repositories/FiscaliaRepository');

describe('FiscaliaService', () => {
  let fiscaliaService: FiscaliaService;
  let mockFiscaliaRepository: jest.Mocked<IFiscaliaRepository>;

  beforeEach(() => {
    // Crear mock del repositorio
    mockFiscaliaRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    // Inyectar mock en el servicio
    fiscaliaService = new FiscaliaService();
    (fiscaliaService as any).fiscaliaRepository = mockFiscaliaRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFiscalia', () => {
    it('debería crear una fiscalía exitosamente', async () => {
      // Arrange
      const createData: CreateFiscaliaDTO = {
        nombre_fiscalia: 'Fiscalía de Delitos contra la Vida',
        direccion: 'Ciudad de Guatemala',
        telefono: '3302-1642',
        usuario_creacion: 'admin',
      };

      const mockFiscalia: Fiscalia = {
        id_fiscalia: 1,
        ...createData,
        activo: true,
        fecha_creacion: new Date(),
      };

      mockFiscaliaRepository.create.mockResolvedValue(mockFiscalia);

      // Act
      const result = await fiscaliaService.createFiscalia(createData);

      // Assert
      expect(result.id_fiscalia).toBe(1);
      expect(result.nombre_fiscalia).toBe('Fiscalía de Delitos contra la Vida');
      expect(mockFiscaliaRepository.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('getFiscaliaById', () => {
    it('debería obtener una fiscalía por ID exitosamente', async () => {
      // Arrange
      const mockFiscalia: Fiscalia = {
        id_fiscalia: 1,
        nombre_fiscalia: 'Fiscalía de Delitos contra la Vida',
        direccion: 'Ciudad de Guatemala',
        telefono: '3302-1642',
        activo: true,
        usuario_creacion: 'admin',
        fecha_creacion: new Date(),
      };

      mockFiscaliaRepository.findById.mockResolvedValue(mockFiscalia);

      // Act
      const result = await fiscaliaService.getFiscaliaById(1);

      // Assert
      expect(result.id_fiscalia).toBe(1);
      expect(result.nombre_fiscalia).toBe('Fiscalía de Delitos contra la Vida');
      expect(mockFiscaliaRepository.findById).toHaveBeenCalledWith(1);
    });

    it('debería lanzar error si la fiscalía no existe', async () => {
      // Arrange
      mockFiscaliaRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(fiscaliaService.getFiscaliaById(999)).rejects.toThrow(
        'Fiscalía no encontrada'
      );
    });
  });

  describe('getAllFiscalias', () => {
    it('debería obtener todas las fiscalías activas', async () => {
      // Arrange
      const mockFiscalias: Fiscalia[] = [
        {
          id_fiscalia: 1,
          nombre_fiscalia: 'Fiscalía de Delitos contra la Vida',
          direccion: 'Ciudad de Guatemala',
          telefono: '3302-1642',
          activo: true,
          usuario_creacion: 'admin',
          fecha_creacion: new Date(),
        },
        {
          id_fiscalia: 2,
          nombre_fiscalia: 'Fiscalía de Delitos Económicos',
          direccion: 'Ciudad de Guatemala',
          telefono: '3302-1642',
          activo: true,
          usuario_creacion: 'admin',
          fecha_creacion: new Date(),
        },
      ];

      mockFiscaliaRepository.findAll.mockResolvedValue(mockFiscalias);

      // Act
      const result = await fiscaliaService.getAllFiscalias({ activo: true });

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].nombre_fiscalia).toBe('Fiscalía de Delitos contra la Vida');
      expect(mockFiscaliaRepository.findAll).toHaveBeenCalledWith({ activo: true });
    });

    it('debería obtener fiscalías sin filtros', async () => {
      // Arrange
      const mockFiscalias: Fiscalia[] = [
        {
          id_fiscalia: 1,
          nombre_fiscalia: 'Fiscalía 1',
          activo: true,
          usuario_creacion: 'admin',
          fecha_creacion: new Date(),
        },
      ];

      mockFiscaliaRepository.findAll.mockResolvedValue(mockFiscalias);

      // Act
      const result = await fiscaliaService.getAllFiscalias();

      // Assert
      expect(result).toHaveLength(1);
      expect(mockFiscaliaRepository.findAll).toHaveBeenCalledWith(undefined);
    });
  });

  describe('updateFiscalia', () => {
    it('debería actualizar una fiscalía exitosamente', async () => {
      // Arrange
      const mockFiscalia: Fiscalia = {
        id_fiscalia: 1,
        nombre_fiscalia: 'Fiscalía de Delitos contra la Vida',
        direccion: 'Ciudad de Guatemala',
        telefono: '3302-1642',
        activo: true,
        usuario_creacion: 'admin',
        fecha_creacion: new Date(),
      };

      const updatedFiscalia: Fiscalia = {
        ...mockFiscalia,
        telefono: '3302-9999',
        usuario_actualizacion: 'admin',
        fecha_actualizacion: new Date(),
      };

      mockFiscaliaRepository.findById.mockResolvedValueOnce(mockFiscalia);
      mockFiscaliaRepository.update.mockResolvedValue();
      mockFiscaliaRepository.findById.mockResolvedValueOnce(updatedFiscalia);

      // Act
      const result = await fiscaliaService.updateFiscalia(1, {
        telefono: '3302-9999',
        usuario_actualizacion: 'admin',
      });

      // Assert
      expect(result).not.toBeNull();
      expect(result!.telefono).toBe('3302-9999');
      expect(mockFiscaliaRepository.update).toHaveBeenCalledWith(1, {
        telefono: '3302-9999',
        usuario_actualizacion: 'admin',
      });
    });

    it('debería lanzar error si la fiscalía no existe al actualizar', async () => {
      // Arrange
      mockFiscaliaRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        fiscaliaService.updateFiscalia(999, {
          telefono: '3302-9999',
          usuario_actualizacion: 'admin',
        })
      ).rejects.toThrow('Fiscalía no encontrada');
    });
  });

  describe('deleteFiscalia', () => {
    it('debería eliminar una fiscalía exitosamente', async () => {
      // Arrange
      const mockFiscalia: Fiscalia = {
        id_fiscalia: 1,
        nombre_fiscalia: 'Fiscalía de Delitos contra la Vida',
        direccion: 'Ciudad de Guatemala',
        telefono: '3302-1642',
        activo: true,
        usuario_creacion: 'admin',
        fecha_creacion: new Date(),
      };

      mockFiscaliaRepository.findById.mockResolvedValue(mockFiscalia);
      mockFiscaliaRepository.delete.mockResolvedValue();

      // Act
      await fiscaliaService.deleteFiscalia(1, 'admin');

      // Assert
      expect(mockFiscaliaRepository.delete).toHaveBeenCalledWith(1, 'admin');
    });

    it('debería lanzar error si la fiscalía no existe al eliminar', async () => {
      // Arrange
      mockFiscaliaRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(fiscaliaService.deleteFiscalia(999, 'admin')).rejects.toThrow(
        'Fiscalía no encontrada'
      );
    });
  });
});
