-- Script para corregir la configuración de usuarios, perfiles y roles
-- Este script separa correctamente los perfiles de Técnico y Coordinador

USE [dicri-indicios];
GO

PRINT '=== INICIANDO CORRECCIÓN DE USUARIOS Y ROLES ===';

-- 1. Limpiar asignaciones existentes
PRINT '1. Limpiando asignaciones existentes...';
DELETE FROM Perfil_Modulo WHERE id_perfil IN (2, 3);
DELETE FROM Perfil_Role WHERE id_perfil = 2;
DELETE FROM Usuario_Perfil WHERE id_usuario IN (2, 3);

-- 2. Actualizar perfil existente y crear nuevo perfil
PRINT '2. Actualizando perfiles...';
UPDATE Perfil 
SET nombre_perfil = 'Técnico DICRI', 
    descripcion = 'Perfil para técnicos que registran expedientes e indicios'
WHERE id_perfil = 2;

-- Verificar si existe el perfil de Coordinador
IF NOT EXISTS (SELECT 1 FROM Perfil WHERE nombre_perfil = 'Coordinador DICRI')
BEGIN
    INSERT INTO Perfil (nombre_perfil, descripcion, usuario_creacion) 
    VALUES ('Coordinador DICRI', 'Perfil para coordinadores que revisan y aprueban expedientes', 'SYSTEM');
END

-- 3. Asignar perfiles a usuarios
PRINT '3. Asignando perfiles a usuarios...';
DECLARE @id_perfil_tecnico INT = (SELECT id_perfil FROM Perfil WHERE nombre_perfil = 'Técnico DICRI');
DECLARE @id_perfil_coordinador INT = (SELECT id_perfil FROM Perfil WHERE nombre_perfil = 'Coordinador DICRI');

-- Usuario tec_1 -> Perfil Técnico DICRI
INSERT INTO Usuario_Perfil (id_usuario, id_perfil, usuario_creacion) 
VALUES (2, @id_perfil_tecnico, 'SYSTEM');

-- Usuario coor_1 -> Perfil Coordinador DICRI
INSERT INTO Usuario_Perfil (id_usuario, id_perfil, usuario_creacion) 
VALUES (3, @id_perfil_coordinador, 'SYSTEM');

-- 4. Asignar roles a perfiles
PRINT '4. Asignando roles a perfiles...';
-- Perfil Administrador (1) -> Role ADMIN (1)
IF NOT EXISTS (SELECT 1 FROM Perfil_Role WHERE id_perfil = 1 AND id_role = 1)
    INSERT INTO Perfil_Role (id_perfil, id_role, usuario_creacion) VALUES (1, 1, 'SYSTEM');

-- Perfil Técnico DICRI -> Role TECNICO_DICRI (2)
INSERT INTO Perfil_Role (id_perfil, id_role, usuario_creacion) 
VALUES (@id_perfil_tecnico, 2, 'SYSTEM');

-- Perfil Coordinador DICRI -> Role COORDINADOR_DICRI (3)
INSERT INTO Perfil_Role (id_perfil, id_role, usuario_creacion) 
VALUES (@id_perfil_coordinador, 3, 'SYSTEM');

-- 5. Asignar módulos a perfiles
PRINT '5. Asignando módulos a perfiles...';

-- Técnico DICRI (Perfil 2) -> Dashboard, Gestión de Expedientes
INSERT INTO Perfil_Modulo (id_perfil, id_modulo, usuario_creacion)
SELECT @id_perfil_tecnico, id_modulo, 'SYSTEM'
FROM Modulo
WHERE nombre_modulo IN ('Dashboard', 'Gestión de Expedientes')
AND activo = 1;

-- Coordinador DICRI (Perfil 3) -> Dashboard, Revisión de Expedientes, Informes y Estadísticas
INSERT INTO Perfil_Modulo (id_perfil, id_modulo, usuario_creacion)
SELECT @id_perfil_coordinador, id_modulo, 'SYSTEM'
FROM Modulo
WHERE nombre_modulo IN ('Dashboard', 'Revisión de Expedientes', 'Informes y Estadísticas')
AND activo = 1;

-- 6. Verificar configuración final
PRINT '';
PRINT '=== VERIFICACIÓN DE CONFIGURACIÓN ===';
PRINT '';
PRINT 'USUARIOS Y SUS PERFILES:';
SELECT 
    u.id_usuario,
    u.nombre_usuario,
    u.nombre + ' ' + u.apellido AS nombre_completo,
    p.nombre_perfil
FROM Usuario u
INNER JOIN Usuario_Perfil up ON u.id_usuario = up.id_usuario
INNER JOIN Perfil p ON up.id_perfil = p.id_perfil
ORDER BY u.id_usuario;

PRINT '';
PRINT 'PERFILES Y SUS ROLES:';
SELECT 
    p.id_perfil,
    p.nombre_perfil,
    r.nombre_role,
    r.descripcion
FROM Perfil p
INNER JOIN Perfil_Role pr ON p.id_perfil = pr.id_perfil
INNER JOIN Role r ON pr.id_role = r.id_role
ORDER BY p.id_perfil;

PRINT '';
PRINT 'PERFILES Y SUS MÓDULOS:';
SELECT 
    p.nombre_perfil,
    m.nombre_modulo,
    m.ruta
FROM Perfil p
INNER JOIN Perfil_Modulo pm ON p.id_perfil = pm.id_perfil
INNER JOIN Modulo m ON pm.id_modulo = m.id_modulo
ORDER BY p.nombre_perfil, m.orden;

PRINT '';
PRINT '=== CORRECCIÓN COMPLETADA EXITOSAMENTE ===';
PRINT '';
PRINT 'CREDENCIALES DE ACCESO:';
PRINT '  admin / admin123        -> Rol: ADMIN';
PRINT '  tec_1 / tecnico123      -> Rol: TECNICO_DICRI';
PRINT '  coor_1 / coordinador123 -> Rol: COORDINADOR_DICRI';
GO
