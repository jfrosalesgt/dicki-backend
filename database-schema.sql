-- =============================================
-- Script DDL para Base de Datos dicri-indicios
-- SQL Server 2022
-- Incluye tablas y procedimientos almacenados
-- =============================================

USE [dicri-indicios];
GO

-- =============================================
-- TABLAS
-- =============================================

-- Tabla: Usuario
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Usuario]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Usuario] (
        [id_usuario] INT IDENTITY(1,1) NOT NULL,
        [nombre_usuario] NVARCHAR(50) NOT NULL,
        [clave] NVARCHAR(255) NOT NULL,
        [nombre] NVARCHAR(100) NOT NULL,
        [apellido] NVARCHAR(100) NOT NULL,
        [email] NVARCHAR(100) NOT NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [cambiar_clave] BIT NOT NULL DEFAULT 0,
        [intentos_fallidos] INT NOT NULL DEFAULT 0,
        [fecha_ultimo_acceso] DATETIME NULL,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED ([id_usuario] ASC),
        CONSTRAINT [UK_Usuario_NombreUsuario] UNIQUE ([nombre_usuario]),
        CONSTRAINT [UK_Usuario_Email] UNIQUE ([email])
    );
END
GO

-- Tabla: Perfil
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Perfil]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Perfil] (
        [id_perfil] INT IDENTITY(1,1) NOT NULL,
        [nombre_perfil] NVARCHAR(100) NOT NULL,
        [descripcion] NVARCHAR(255) NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Perfil] PRIMARY KEY CLUSTERED ([id_perfil] ASC),
        CONSTRAINT [UK_Perfil_Nombre] UNIQUE ([nombre_perfil])
    );
END
GO

-- Tabla: Modulo
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Modulo]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Modulo] (
        [id_modulo] INT IDENTITY(1,1) NOT NULL,
        [nombre_modulo] NVARCHAR(100) NOT NULL,
        [descripcion] NVARCHAR(255) NULL,
        [ruta] NVARCHAR(255) NULL,
        [icono] NVARCHAR(50) NULL,
        [orden] INT NOT NULL DEFAULT 0,
        [id_modulo_padre] INT NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Modulo] PRIMARY KEY CLUSTERED ([id_modulo] ASC),
        CONSTRAINT [FK_Modulo_ModuloPadre] FOREIGN KEY ([id_modulo_padre]) 
            REFERENCES [dbo].[Modulo]([id_modulo])
    );
END
GO

-- Tabla: Role
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Role]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Role] (
        [id_role] INT IDENTITY(1,1) NOT NULL,
        [nombre_role] NVARCHAR(100) NOT NULL,
        [descripcion] NVARCHAR(255) NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED ([id_role] ASC),
        CONSTRAINT [UK_Role_Nombre] UNIQUE ([nombre_role])
    );
END
GO

-- Tabla: Usuario_Perfil
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Usuario_Perfil]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Usuario_Perfil] (
        [id_usuario_perfil] INT IDENTITY(1,1) NOT NULL,
        [id_usuario] INT NOT NULL,
        [id_perfil] INT NOT NULL,
        [fecha_inicio] DATETIME NOT NULL DEFAULT GETDATE(),
        [fecha_fin] DATETIME NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Usuario_Perfil] PRIMARY KEY CLUSTERED ([id_usuario_perfil] ASC),
        CONSTRAINT [FK_Usuario_Perfil_Usuario] FOREIGN KEY ([id_usuario]) 
            REFERENCES [dbo].[Usuario]([id_usuario]),
        CONSTRAINT [FK_Usuario_Perfil_Perfil] FOREIGN KEY ([id_perfil]) 
            REFERENCES [dbo].[Perfil]([id_perfil]),
        CONSTRAINT [UK_Usuario_Perfil] UNIQUE ([id_usuario], [id_perfil])
    );
END
GO

-- Tabla: Perfil_Modulo
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Perfil_Modulo]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Perfil_Modulo] (
        [id_perfil_modulo] INT IDENTITY(1,1) NOT NULL,
        [id_perfil] INT NOT NULL,
        [id_modulo] INT NOT NULL,
        [puede_leer] BIT NOT NULL DEFAULT 1,
        [puede_crear] BIT NOT NULL DEFAULT 0,
        [puede_editar] BIT NOT NULL DEFAULT 0,
        [puede_eliminar] BIT NOT NULL DEFAULT 0,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Perfil_Modulo] PRIMARY KEY CLUSTERED ([id_perfil_modulo] ASC),
        CONSTRAINT [FK_Perfil_Modulo_Perfil] FOREIGN KEY ([id_perfil]) 
            REFERENCES [dbo].[Perfil]([id_perfil]),
        CONSTRAINT [FK_Perfil_Modulo_Modulo] FOREIGN KEY ([id_modulo]) 
            REFERENCES [dbo].[Modulo]([id_modulo]),
        CONSTRAINT [UK_Perfil_Modulo] UNIQUE ([id_perfil], [id_modulo])
    );
END
GO

-- Tabla: Role_Modulo
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Role_Modulo]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Role_Modulo] (
        [id_role_modulo] INT IDENTITY(1,1) NOT NULL,
        [id_role] INT NOT NULL,
        [id_modulo] INT NOT NULL,
        [puede_leer] BIT NOT NULL DEFAULT 1,
        [puede_crear] BIT NOT NULL DEFAULT 0,
        [puede_editar] BIT NOT NULL DEFAULT 0,
        [puede_eliminar] BIT NOT NULL DEFAULT 0,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Role_Modulo] PRIMARY KEY CLUSTERED ([id_role_modulo] ASC),
        CONSTRAINT [FK_Role_Modulo_Role] FOREIGN KEY ([id_role]) 
            REFERENCES [dbo].[Role]([id_role]),
        CONSTRAINT [FK_Role_Modulo_Modulo] FOREIGN KEY ([id_modulo]) 
            REFERENCES [dbo].[Modulo]([id_modulo]),
        CONSTRAINT [UK_Role_Modulo] UNIQUE ([id_role], [id_modulo])
    );
END
GO

-- Tabla: Perfil_Role
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Perfil_Role]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Perfil_Role] (
        [id_perfil_role] INT IDENTITY(1,1) NOT NULL,
        [id_perfil] INT NOT NULL,
        [id_role] INT NOT NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Perfil_Role] PRIMARY KEY CLUSTERED ([id_perfil_role] ASC),
        CONSTRAINT [FK_Perfil_Role_Perfil] FOREIGN KEY ([id_perfil]) 
            REFERENCES [dbo].[Perfil]([id_perfil]),
        CONSTRAINT [FK_Perfil_Role_Role] FOREIGN KEY ([id_role]) 
            REFERENCES [dbo].[Role]([id_role]),
        CONSTRAINT [UK_Perfil_Role] UNIQUE ([id_perfil], [id_role])
    );
END
GO

-- =============================================
-- ÍNDICES
-- =============================================

CREATE NONCLUSTERED INDEX [IX_Usuario_Email] ON [dbo].[Usuario] ([email]);
CREATE NONCLUSTERED INDEX [IX_Usuario_Activo] ON [dbo].[Usuario] ([activo]);
CREATE NONCLUSTERED INDEX [IX_Perfil_Activo] ON [dbo].[Perfil] ([activo]);
CREATE NONCLUSTERED INDEX [IX_Modulo_Activo] ON [dbo].[Modulo] ([activo]);
CREATE NONCLUSTERED INDEX [IX_Modulo_Padre] ON [dbo].[Modulo] ([id_modulo_padre]);
CREATE NONCLUSTERED INDEX [IX_Role_Activo] ON [dbo].[Role] ([activo]);
CREATE NONCLUSTERED INDEX [IX_Usuario_Perfil_Usuario] ON [dbo].[Usuario_Perfil] ([id_usuario]);
CREATE NONCLUSTERED INDEX [IX_Usuario_Perfil_Perfil] ON [dbo].[Usuario_Perfil] ([id_perfil]);
CREATE NONCLUSTERED INDEX [IX_Perfil_Modulo_Perfil] ON [dbo].[Perfil_Modulo] ([id_perfil]);
CREATE NONCLUSTERED INDEX [IX_Perfil_Modulo_Modulo] ON [dbo].[Perfil_Modulo] ([id_modulo]);
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - USUARIO
-- =============================================

-- SP: Usuario - Buscar por ID
IF OBJECT_ID('sp_Usuario_FindById', 'P') IS NOT NULL
    DROP PROCEDURE sp_Usuario_FindById;
GO

CREATE PROCEDURE sp_Usuario_FindById
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Usuario WHERE id_usuario = @id_usuario;
END
GO

-- SP: Usuario - Buscar por nombre de usuario
IF OBJECT_ID('sp_Usuario_FindByUsername', 'P') IS NOT NULL
    DROP PROCEDURE sp_Usuario_FindByUsername;
GO

CREATE PROCEDURE sp_Usuario_FindByUsername
    @nombre_usuario NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Usuario WHERE nombre_usuario = @nombre_usuario;
END
GO

-- SP: Usuario - Buscar por email
IF OBJECT_ID('sp_Usuario_FindByEmail', 'P') IS NOT NULL
    DROP PROCEDURE sp_Usuario_FindByEmail;
GO

CREATE PROCEDURE sp_Usuario_FindByEmail
    @email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Usuario WHERE email = @email;
END
GO

-- SP: Usuario - Crear
IF OBJECT_ID('sp_Usuario_Create', 'P') IS NOT NULL
    DROP PROCEDURE sp_Usuario_Create;
GO

CREATE PROCEDURE sp_Usuario_Create
    @nombre_usuario NVARCHAR(50),
    @clave NVARCHAR(255),
    @nombre NVARCHAR(100),
    @apellido NVARCHAR(100),
    @email NVARCHAR(100),
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Usuario (nombre_usuario, clave, nombre, apellido, email, usuario_creacion)
    VALUES (@nombre_usuario, @clave, @nombre, @apellido, @email, @usuario_creacion);
    
    SELECT * FROM Usuario WHERE id_usuario = SCOPE_IDENTITY();
END
GO

-- SP: Usuario - Actualizar
IF OBJECT_ID('sp_Usuario_Update', 'P') IS NOT NULL
    DROP PROCEDURE sp_Usuario_Update;
GO

CREATE PROCEDURE sp_Usuario_Update
    @id_usuario INT,
    @nombre NVARCHAR(100) = NULL,
    @apellido NVARCHAR(100) = NULL,
    @email NVARCHAR(100) = NULL,
    @activo BIT = NULL,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Usuario
    SET 
        nombre = ISNULL(@nombre, nombre),
        apellido = ISNULL(@apellido, apellido),
        email = ISNULL(@email, email),
        activo = ISNULL(@activo, activo),
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_usuario = @id_usuario;
END
GO

-- SP: Usuario - Actualizar contraseña
IF OBJECT_ID('sp_Usuario_UpdatePassword', 'P') IS NOT NULL
    DROP PROCEDURE sp_Usuario_UpdatePassword;
GO

CREATE PROCEDURE sp_Usuario_UpdatePassword
    @id_usuario INT,
    @clave NVARCHAR(255),
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Usuario
    SET 
        clave = @clave,
        cambiar_clave = 0,
        intentos_fallidos = 0,
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_usuario = @id_usuario;
END
GO

-- SP: Usuario - Actualizar último acceso
IF OBJECT_ID('sp_Usuario_UpdateLastAccess', 'P') IS NOT NULL
    DROP PROCEDURE sp_Usuario_UpdateLastAccess;
GO

CREATE PROCEDURE sp_Usuario_UpdateLastAccess
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Usuario SET fecha_ultimo_acceso = GETDATE() WHERE id_usuario = @id_usuario;
END
GO

-- SP: Usuario - Incrementar intentos fallidos
IF OBJECT_ID('sp_Usuario_IncrementFailedAttempts', 'P') IS NOT NULL
    DROP PROCEDURE sp_Usuario_IncrementFailedAttempts;
GO

CREATE PROCEDURE sp_Usuario_IncrementFailedAttempts
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Usuario SET intentos_fallidos = intentos_fallidos + 1 WHERE id_usuario = @id_usuario;
END
GO

-- SP: Usuario - Resetear intentos fallidos
IF OBJECT_ID('sp_Usuario_ResetFailedAttempts', 'P') IS NOT NULL
    DROP PROCEDURE sp_Usuario_ResetFailedAttempts;
GO

CREATE PROCEDURE sp_Usuario_ResetFailedAttempts
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Usuario SET intentos_fallidos = 0 WHERE id_usuario = @id_usuario;
END
GO

-- SP: Usuario - Listar todos
IF OBJECT_ID('sp_Usuario_FindAll', 'P') IS NOT NULL
    DROP PROCEDURE sp_Usuario_FindAll;
GO

CREATE PROCEDURE sp_Usuario_FindAll
    @activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @activo IS NULL
        SELECT * FROM Usuario;
    ELSE
        SELECT * FROM Usuario WHERE activo = @activo;
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - PERFIL
-- =============================================

-- SP: Perfil - Buscar por ID
IF OBJECT_ID('sp_Perfil_FindById', 'P') IS NOT NULL
    DROP PROCEDURE sp_Perfil_FindById;
GO

CREATE PROCEDURE sp_Perfil_FindById
    @id_perfil INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Perfil WHERE id_perfil = @id_perfil;
END
GO

-- SP: Perfil - Buscar por nombre
IF OBJECT_ID('sp_Perfil_FindByName', 'P') IS NOT NULL
    DROP PROCEDURE sp_Perfil_FindByName;
GO

CREATE PROCEDURE sp_Perfil_FindByName
    @nombre_perfil NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Perfil WHERE nombre_perfil = @nombre_perfil;
END
GO

-- SP: Perfil - Crear
IF OBJECT_ID('sp_Perfil_Create', 'P') IS NOT NULL
    DROP PROCEDURE sp_Perfil_Create;
GO

CREATE PROCEDURE sp_Perfil_Create
    @nombre_perfil NVARCHAR(100),
    @descripcion NVARCHAR(255) = NULL,
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Perfil (nombre_perfil, descripcion, usuario_creacion)
    VALUES (@nombre_perfil, @descripcion, @usuario_creacion);
    
    SELECT * FROM Perfil WHERE id_perfil = SCOPE_IDENTITY();
END
GO

-- SP: Perfil - Actualizar
IF OBJECT_ID('sp_Perfil_Update', 'P') IS NOT NULL
    DROP PROCEDURE sp_Perfil_Update;
GO

CREATE PROCEDURE sp_Perfil_Update
    @id_perfil INT,
    @nombre_perfil NVARCHAR(100) = NULL,
    @descripcion NVARCHAR(255) = NULL,
    @activo BIT = NULL,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Perfil
    SET 
        nombre_perfil = ISNULL(@nombre_perfil, nombre_perfil),
        descripcion = ISNULL(@descripcion, descripcion),
        activo = ISNULL(@activo, activo),
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_perfil = @id_perfil;
END
GO

-- SP: Perfil - Listar todos
IF OBJECT_ID('sp_Perfil_FindAll', 'P') IS NOT NULL
    DROP PROCEDURE sp_Perfil_FindAll;
GO

CREATE PROCEDURE sp_Perfil_FindAll
    @activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @activo IS NULL
        SELECT * FROM Perfil;
    ELSE
        SELECT * FROM Perfil WHERE activo = @activo;
END
GO

-- SP: Perfil - Buscar por usuario
IF OBJECT_ID('sp_Perfil_FindByUsuario', 'P') IS NOT NULL
    DROP PROCEDURE sp_Perfil_FindByUsuario;
GO

CREATE PROCEDURE sp_Perfil_FindByUsuario
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT p.*
    FROM Perfil p
    INNER JOIN Usuario_Perfil up ON p.id_perfil = up.id_perfil
    WHERE up.id_usuario = @id_usuario 
      AND p.activo = 1 
      AND up.activo = 1
      AND (up.fecha_fin IS NULL OR up.fecha_fin > GETDATE());
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - ROLE
-- =============================================

-- SP: Role - Buscar por ID
IF OBJECT_ID('sp_Role_FindById', 'P') IS NOT NULL
    DROP PROCEDURE sp_Role_FindById;
GO

CREATE PROCEDURE sp_Role_FindById
    @id_role INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Role WHERE id_role = @id_role;
END
GO

-- SP: Role - Buscar por nombre
IF OBJECT_ID('sp_Role_FindByName', 'P') IS NOT NULL
    DROP PROCEDURE sp_Role_FindByName;
GO

CREATE PROCEDURE sp_Role_FindByName
    @nombre_role NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Role WHERE nombre_role = @nombre_role;
END
GO

-- SP: Role - Crear
IF OBJECT_ID('sp_Role_Create', 'P') IS NOT NULL
    DROP PROCEDURE sp_Role_Create;
GO

CREATE PROCEDURE sp_Role_Create
    @nombre_role NVARCHAR(100),
    @descripcion NVARCHAR(255) = NULL,
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Role (nombre_role, descripcion, usuario_creacion)
    VALUES (@nombre_role, @descripcion, @usuario_creacion);
    
    SELECT * FROM Role WHERE id_role = SCOPE_IDENTITY();
END
GO

-- SP: Role - Actualizar
IF OBJECT_ID('sp_Role_Update', 'P') IS NOT NULL
    DROP PROCEDURE sp_Role_Update;
GO

CREATE PROCEDURE sp_Role_Update
    @id_role INT,
    @nombre_role NVARCHAR(100) = NULL,
    @descripcion NVARCHAR(255) = NULL,
    @activo BIT = NULL,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Role
    SET 
        nombre_role = ISNULL(@nombre_role, nombre_role),
        descripcion = ISNULL(@descripcion, descripcion),
        activo = ISNULL(@activo, activo),
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_role = @id_role;
END
GO

-- SP: Role - Listar todos
IF OBJECT_ID('sp_Role_FindAll', 'P') IS NOT NULL
    DROP PROCEDURE sp_Role_FindAll;
GO

CREATE PROCEDURE sp_Role_FindAll
    @activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @activo IS NULL
        SELECT * FROM Role;
    ELSE
        SELECT * FROM Role WHERE activo = @activo;
END
GO

-- SP: Role - Buscar por usuario
IF OBJECT_ID('sp_Role_FindByUsuario', 'P') IS NOT NULL
    DROP PROCEDURE sp_Role_FindByUsuario;
GO

CREATE PROCEDURE sp_Role_FindByUsuario
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT r.*
    FROM Role r
    INNER JOIN Perfil_Role pr ON r.id_role = pr.id_role
    INNER JOIN Usuario_Perfil up ON pr.id_perfil = up.id_perfil
    WHERE up.id_usuario = @id_usuario 
      AND r.activo = 1 
      AND pr.activo = 1
      AND up.activo = 1
      AND (up.fecha_fin IS NULL OR up.fecha_fin > GETDATE());
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - MODULO
-- =============================================

-- SP: Modulo - Buscar por ID
IF OBJECT_ID('sp_Modulo_FindById', 'P') IS NOT NULL
    DROP PROCEDURE sp_Modulo_FindById;
GO

CREATE PROCEDURE sp_Modulo_FindById
    @id_modulo INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Modulo WHERE id_modulo = @id_modulo;
END
GO

-- SP: Modulo - Crear
IF OBJECT_ID('sp_Modulo_Create', 'P') IS NOT NULL
    DROP PROCEDURE sp_Modulo_Create;
GO

CREATE PROCEDURE sp_Modulo_Create
    @nombre_modulo NVARCHAR(100),
    @descripcion NVARCHAR(255) = NULL,
    @ruta NVARCHAR(255) = NULL,
    @icono NVARCHAR(50) = NULL,
    @orden INT = 0,
    @id_modulo_padre INT = NULL,
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Modulo (nombre_modulo, descripcion, ruta, icono, orden, id_modulo_padre, usuario_creacion)
    VALUES (@nombre_modulo, @descripcion, @ruta, @icono, @orden, @id_modulo_padre, @usuario_creacion);
    
    SELECT * FROM Modulo WHERE id_modulo = SCOPE_IDENTITY();
END
GO

-- SP: Modulo - Actualizar
IF OBJECT_ID('sp_Modulo_Update', 'P') IS NOT NULL
    DROP PROCEDURE sp_Modulo_Update;
GO

CREATE PROCEDURE sp_Modulo_Update
    @id_modulo INT,
    @nombre_modulo NVARCHAR(100) = NULL,
    @descripcion NVARCHAR(255) = NULL,
    @ruta NVARCHAR(255) = NULL,
    @icono NVARCHAR(50) = NULL,
    @orden INT = NULL,
    @id_modulo_padre INT = NULL,
    @activo BIT = NULL,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Modulo
    SET 
        nombre_modulo = ISNULL(@nombre_modulo, nombre_modulo),
        descripcion = ISNULL(@descripcion, descripcion),
        ruta = ISNULL(@ruta, ruta),
        icono = ISNULL(@icono, icono),
        orden = ISNULL(@orden, orden),
        id_modulo_padre = ISNULL(@id_modulo_padre, id_modulo_padre),
        activo = ISNULL(@activo, activo),
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_modulo = @id_modulo;
END
GO

-- SP: Modulo - Listar todos
IF OBJECT_ID('sp_Modulo_FindAll', 'P') IS NOT NULL
    DROP PROCEDURE sp_Modulo_FindAll;
GO

CREATE PROCEDURE sp_Modulo_FindAll
    @activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @activo IS NULL
        SELECT * FROM Modulo ORDER BY orden, nombre_modulo;
    ELSE
        SELECT * FROM Modulo WHERE activo = @activo ORDER BY orden, nombre_modulo;
END
GO

-- SP: Modulo - Buscar por perfil
IF OBJECT_ID('sp_Modulo_FindByPerfil', 'P') IS NOT NULL
    DROP PROCEDURE sp_Modulo_FindByPerfil;
GO

CREATE PROCEDURE sp_Modulo_FindByPerfil
    @id_perfil INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT m.*
    FROM Modulo m
    INNER JOIN Perfil_Modulo pm ON m.id_modulo = pm.id_modulo
    WHERE pm.id_perfil = @id_perfil 
      AND m.activo = 1 
      AND pm.activo = 1
    ORDER BY m.orden, m.nombre_modulo;
END
GO

-- SP: Modulo - Buscar por usuario
IF OBJECT_ID('sp_Modulo_FindByUsuario', 'P') IS NOT NULL
    DROP PROCEDURE sp_Modulo_FindByUsuario;
GO

CREATE PROCEDURE sp_Modulo_FindByUsuario
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT m.*
    FROM Modulo m
    INNER JOIN Perfil_Modulo pm ON m.id_modulo = pm.id_modulo
    INNER JOIN Usuario_Perfil up ON pm.id_perfil = up.id_perfil
    WHERE up.id_usuario = @id_usuario 
      AND m.activo = 1 
      AND pm.activo = 1
      AND up.activo = 1
      AND (up.fecha_fin IS NULL OR up.fecha_fin > GETDATE())
    ORDER BY m.orden, m.nombre_modulo;
END
GO

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Insertar usuario administrador por defecto
IF NOT EXISTS (SELECT * FROM [dbo].[Usuario] WHERE [nombre_usuario] = 'admin')
BEGIN
    INSERT INTO [dbo].[Usuario] 
        ([nombre_usuario], [clave], [nombre], [apellido], [email], [activo], [cambiar_clave], [usuario_creacion])
    VALUES 
        ('admin', '0192023a7bbd73250516f069df18b500', 'Administrador', 'Sistema', 'admin@dicri.com', 1, 1, 'SYSTEM');
END
GO

-- Insertar perfil administrador
IF NOT EXISTS (SELECT * FROM [dbo].[Perfil] WHERE [nombre_perfil] = 'Administrador')
BEGIN
    INSERT INTO [dbo].[Perfil] 
        ([nombre_perfil], [descripcion], [activo], [usuario_creacion])
    VALUES 
        ('Administrador', 'Perfil con acceso total al sistema', 1, 'SYSTEM');
END
GO

-- Insertar role administrador
IF NOT EXISTS (SELECT * FROM [dbo].[Role] WHERE [nombre_role] = 'ADMIN')
BEGIN
    INSERT INTO [dbo].[Role] 
        ([nombre_role], [descripcion], [activo], [usuario_creacion])
    VALUES 
        ('ADMIN', 'Role de administrador del sistema', 1, 'SYSTEM');
END
GO

-- Asignar perfil al usuario administrador
IF NOT EXISTS (SELECT * FROM [dbo].[Usuario_Perfil] WHERE [id_usuario] = 1 AND [id_perfil] = 1)
BEGIN
    INSERT INTO [dbo].[Usuario_Perfil] 
        ([id_usuario], [id_perfil], [activo], [usuario_creacion])
    VALUES 
        (1, 1, 1, 'SYSTEM');
END
GO

-- Asignar role al perfil administrador
IF NOT EXISTS (SELECT * FROM [dbo].[Perfil_Role] WHERE [id_perfil] = 1 AND [id_role] = 1)
BEGIN
    INSERT INTO [dbo].[Perfil_Role] 
        ([id_perfil], [id_role], [activo], [usuario_creacion])
    VALUES 
        (1, 1, 1, 'SYSTEM');
END
GO

-- =============================================
-- Nuevas Tablas para el Negocio (DICRI)
-- =============================================

-- Tabla: Fiscalia
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Fiscalia]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Fiscalia] (
        [id_fiscalia] INT IDENTITY(1,1) NOT NULL,
        [nombre_fiscalia] NVARCHAR(150) NOT NULL,
        [direccion] NVARCHAR(255) NULL,
        [telefono] NVARCHAR(20) NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Fiscalia] PRIMARY KEY CLUSTERED ([id_fiscalia] ASC),
        CONSTRAINT [UK_Fiscalia_Nombre] UNIQUE ([nombre_fiscalia])
    );
END
GO

-- Tabla: Investigacion (Caso o Carpeta)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Investigacion]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Investigacion] (
        [id_investigacion] INT IDENTITY(1,1) NOT NULL,
        [codigo_caso] NVARCHAR(50) NOT NULL, -- Ej: MP001-2023-12345
        [nombre_caso] NVARCHAR(255) NOT NULL,
        [fecha_inicio] DATE NOT NULL,
        [id_fiscalia] INT NOT NULL,
        [descripcion_hechos] NVARCHAR(MAX) NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Investigacion] PRIMARY KEY CLUSTERED ([id_investigacion] ASC),
        CONSTRAINT [UK_Investigacion_Codigo] UNIQUE ([codigo_caso]),
        CONSTRAINT [FK_Investigacion_Fiscalia] FOREIGN KEY ([id_fiscalia]) 
            REFERENCES [dbo].[Fiscalia]([id_fiscalia])
    );
END
GO

-- Tabla: Escena (Lugar de recolección de indicios)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Escena]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Escena] (
        [id_escena] INT IDENTITY(1,1) NOT NULL,
        [id_investigacion] INT NOT NULL,
        [nombre_escena] NVARCHAR(150) NOT NULL, -- Ej: "Escena Principal", "Vehículo Víctima"
        [direccion_escena] NVARCHAR(255) NOT NULL,
        [fecha_hora_inicio] DATETIME NOT NULL,
        [fecha_hora_fin] DATETIME NULL,
        [descripcion] NVARCHAR(MAX) NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Escena] PRIMARY KEY CLUSTERED ([id_escena] ASC),
        CONSTRAINT [FK_Escena_Investigacion] FOREIGN KEY ([id_investigacion]) 
            REFERENCES [dbo].[Investigacion]([id_investigacion])
    );
END
GO

-- Tabla: TipoIndicio (Catálogo de Tipos de Evidencia)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TipoIndicio]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TipoIndicio] (
        [id_tipo_indicio] INT IDENTITY(1,1) NOT NULL,
        [nombre_tipo] NVARCHAR(100) NOT NULL,
        [descripcion] NVARCHAR(255) NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_TipoIndicio] PRIMARY KEY CLUSTERED ([id_tipo_indicio] ASC),
        CONSTRAINT [UK_TipoIndicio_Nombre] UNIQUE ([nombre_tipo])
    );
END
GO

-- Tabla: Indicio (La evidencia recolectada)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Indicio]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Indicio] (
        [id_indicio] INT IDENTITY(1,1) NOT NULL,
        [codigo_indicio] NVARCHAR(50) NOT NULL, -- Código único de Indicio (etiqueta)
        [id_escena] INT NOT NULL,
        [id_tipo_indicio] INT NOT NULL,
        [descripcion_corta] NVARCHAR(255) NOT NULL,
        [ubicacion_especifica] NVARCHAR(100) NULL, -- Ej: "Bajo la mesa", "Dentro de la guantera"
        [fecha_hora_recoleccion] DATETIME NOT NULL,
        [id_usuario_recolector] INT NOT NULL,
        [estado_actual] NVARCHAR(50) NOT NULL DEFAULT 'RECOLECTADO', -- Ultimo estado de la cadena
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_Indicio] PRIMARY KEY CLUSTERED ([id_indicio] ASC),
        CONSTRAINT [UK_Indicio_Codigo] UNIQUE ([codigo_indicio]),
        CONSTRAINT [FK_Indicio_Escena] FOREIGN KEY ([id_escena]) 
            REFERENCES [dbo].[Escena]([id_escena]),
        CONSTRAINT [FK_Indicio_TipoIndicio] FOREIGN KEY ([id_tipo_indicio]) 
            REFERENCES [dbo].[TipoIndicio]([id_tipo_indicio]),
        CONSTRAINT [FK_Indicio_UsuarioRecolector] FOREIGN KEY ([id_usuario_recolector]) 
            REFERENCES [dbo].[Usuario]([id_usuario])
    );
END
GO

-- Tabla: EstadoCadena (Catálogo de Estados de Custodia)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EstadoCadena]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[EstadoCadena] (
        [id_estado_cadena] INT IDENTITY(1,1) NOT NULL,
        [nombre_estado] NVARCHAR(100) NOT NULL,
        [descripcion] NVARCHAR(255) NULL,
        [activo] BIT NOT NULL DEFAULT 1,
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        [usuario_actualizacion] NVARCHAR(50) NULL,
        [fecha_actualizacion] DATETIME NULL,
        CONSTRAINT [PK_EstadoCadena] PRIMARY KEY CLUSTERED ([id_estado_cadena] ASC),
        CONSTRAINT [UK_EstadoCadena_Nombre] UNIQUE ([nombre_estado])
    );
END
GO

-- Tabla: CadenaCustodia (Registro de movimientos del indicio)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CadenaCustodia]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[CadenaCustodia] (
        [id_cadena_custodia] BIGINT IDENTITY(1,1) NOT NULL,
        [id_indicio] INT NOT NULL,
        [id_estado_cadena] INT NOT NULL,
        [fecha_movimiento] DATETIME NOT NULL DEFAULT GETDATE(),
        [id_usuario_responsable] INT NOT NULL, -- Usuario que realiza el movimiento
        [observaciones] NVARCHAR(MAX) NULL,
        [documento_referencia] NVARCHAR(100) NULL, -- Ej: Número de oficio, número de traslado
        [usuario_creacion] NVARCHAR(50) NOT NULL,
        [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_CadenaCustodia] PRIMARY KEY CLUSTERED ([id_cadena_custodia] ASC),
        CONSTRAINT [FK_CadenaCustodia_Indicio] FOREIGN KEY ([id_indicio]) 
            REFERENCES [dbo].[Indicio]([id_indicio]),
        CONSTRAINT [FK_CadenaCustodia_Estado] FOREIGN KEY ([id_estado_cadena]) 
            REFERENCES [dbo].[EstadoCadena]([id_estado_cadena]),
        CONSTRAINT [FK_CadenaCustodia_Usuario] FOREIGN KEY ([id_usuario_responsable]) 
            REFERENCES [dbo].[Usuario]([id_usuario])
    );
END
GO

-- =============================================
-- ÍNDICES ADICIONALES
-- =============================================

CREATE NONCLUSTERED INDEX [IX_Investigacion_Fiscalia] ON [dbo].[Investigacion] ([id_fiscalia]);
CREATE NONCLUSTERED INDEX [IX_Escena_Investigacion] ON [dbo].[Escena] ([id_investigacion]);
CREATE NONCLUSTERED INDEX [IX_Indicio_Escena] ON [dbo].[Indicio] ([id_escena]);
CREATE NONCLUSTERED INDEX [IX_Indicio_Tipo] ON [dbo].[Indicio] ([id_tipo_indicio]);
CREATE NONCLUSTERED INDEX [IX_Indicio_Recolector] ON [dbo].[Indicio] ([id_usuario_recolector]);
CREATE NONCLUSTERED INDEX [IX_CadenaCustodia_Indicio] ON [dbo].[CadenaCustodia] ([id_indicio]);
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - FISCALIA (CRUD)
-- =============================================

-- CREATE
IF OBJECT_ID('sp_Fiscalia_Create', 'P') IS NOT NULL DROP PROCEDURE sp_Fiscalia_Create;
GO
CREATE PROCEDURE sp_Fiscalia_Create
    @nombre_fiscalia NVARCHAR(150),
    @direccion NVARCHAR(255) = NULL,
    @telefono NVARCHAR(20) = NULL,
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Fiscalia (nombre_fiscalia, direccion, telefono, usuario_creacion)
    VALUES (@nombre_fiscalia, @direccion, @telefono, @usuario_creacion);
    SELECT * FROM Fiscalia WHERE id_fiscalia = SCOPE_IDENTITY();
END
GO

-- READ (Find All)
IF OBJECT_ID('sp_Fiscalia_FindAll', 'P') IS NOT NULL DROP PROCEDURE sp_Fiscalia_FindAll;
GO
CREATE PROCEDURE sp_Fiscalia_FindAll
    @activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @activo IS NULL
        SELECT * FROM Fiscalia ORDER BY nombre_fiscalia;
    ELSE
        SELECT * FROM Fiscalia WHERE activo = @activo ORDER BY nombre_fiscalia;
END
GO

-- READ (Find By ID)
IF OBJECT_ID('sp_Fiscalia_FindById', 'P') IS NOT NULL DROP PROCEDURE sp_Fiscalia_FindById;
GO
CREATE PROCEDURE sp_Fiscalia_FindById
    @id_fiscalia INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Fiscalia WHERE id_fiscalia = @id_fiscalia;
END
GO

-- UPDATE
IF OBJECT_ID('sp_Fiscalia_Update', 'P') IS NOT NULL DROP PROCEDURE sp_Fiscalia_Update;
GO
CREATE PROCEDURE sp_Fiscalia_Update
    @id_fiscalia INT,
    @nombre_fiscalia NVARCHAR(150) = NULL,
    @direccion NVARCHAR(255) = NULL,
    @telefono NVARCHAR(20) = NULL,
    @activo BIT = NULL,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Fiscalia
    SET 
        nombre_fiscalia = ISNULL(@nombre_fiscalia, nombre_fiscalia),
        direccion = ISNULL(@direccion, direccion),
        telefono = ISNULL(@telefono, telefono),
        activo = ISNULL(@activo, activo),
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_fiscalia = @id_fiscalia;
END
GO

-- DELETE (Lógico)
IF OBJECT_ID('sp_Fiscalia_Delete', 'P') IS NOT NULL DROP PROCEDURE sp_Fiscalia_Delete;
GO
CREATE PROCEDURE sp_Fiscalia_Delete
    @id_fiscalia INT,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Fiscalia
    SET 
        activo = 0,
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_fiscalia = @id_fiscalia;
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - INVESTIGACION (CRUD)
-- =============================================

-- CREATE
IF OBJECT_ID('sp_Investigacion_Create', 'P') IS NOT NULL DROP PROCEDURE sp_Investigacion_Create;
GO
CREATE PROCEDURE sp_Investigacion_Create
    @codigo_caso NVARCHAR(50),
    @nombre_caso NVARCHAR(255),
    @fecha_inicio DATE,
    @id_fiscalia INT,
    @descripcion_hechos NVARCHAR(MAX) = NULL,
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Investigacion (codigo_caso, nombre_caso, fecha_inicio, id_fiscalia, descripcion_hechos, usuario_creacion)
    VALUES (@codigo_caso, @nombre_caso, @fecha_inicio, @id_fiscalia, @descripcion_hechos, @usuario_creacion);
    SELECT * FROM Investigacion WHERE id_investigacion = SCOPE_IDENTITY();
END
GO

-- READ (Find All/List)
IF OBJECT_ID('sp_Investigacion_FindAll', 'P') IS NOT NULL DROP PROCEDURE sp_Investigacion_FindAll;
GO
CREATE PROCEDURE sp_Investigacion_FindAll
    @activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT i.*, f.nombre_fiscalia
    FROM Investigacion i
    INNER JOIN Fiscalia f ON i.id_fiscalia = f.id_fiscalia
    WHERE i.activo = ISNULL(@activo, i.activo)
    ORDER BY i.fecha_inicio DESC;
END
GO

-- READ (Find By ID)
IF OBJECT_ID('sp_Investigacion_FindById', 'P') IS NOT NULL DROP PROCEDURE sp_Investigacion_FindById;
GO
CREATE PROCEDURE sp_Investigacion_FindById
    @id_investigacion INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT i.*, f.nombre_fiscalia
    FROM Investigacion i
    INNER JOIN Fiscalia f ON i.id_fiscalia = f.id_fiscalia
    WHERE i.id_investigacion = @id_investigacion;
END
GO

-- UPDATE
IF OBJECT_ID('sp_Investigacion_Update', 'P') IS NOT NULL DROP PROCEDURE sp_Investigacion_Update;
GO
CREATE PROCEDURE sp_Investigacion_Update
    @id_investigacion INT,
    @nombre_caso NVARCHAR(255) = NULL,
    @fecha_inicio DATE = NULL,
    @id_fiscalia INT = NULL,
    @descripcion_hechos NVARCHAR(MAX) = NULL,
    @activo BIT = NULL,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Investigacion
    SET 
        nombre_caso = ISNULL(@nombre_caso, nombre_caso),
        fecha_inicio = ISNULL(@fecha_inicio, fecha_inicio),
        id_fiscalia = ISNULL(@id_fiscalia, id_fiscalia),
        descripcion_hechos = ISNULL(@descripcion_hechos, descripcion_hechos),
        activo = ISNULL(@activo, activo),
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_investigacion = @id_investigacion;
END
GO

-- DELETE (Lógico)
IF OBJECT_ID('sp_Investigacion_Delete', 'P') IS NOT NULL DROP PROCEDURE sp_Investigacion_Delete;
GO
CREATE PROCEDURE sp_Investigacion_Delete
    @id_investigacion INT,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Investigacion
    SET 
        activo = 0,
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_investigacion = @id_investigacion;
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - ESCENA (CRUD)
-- =============================================

-- CREATE
IF OBJECT_ID('sp_Escena_Create', 'P') IS NOT NULL DROP PROCEDURE sp_Escena_Create;
GO
CREATE PROCEDURE sp_Escena_Create
    @id_investigacion INT,
    @nombre_escena NVARCHAR(150),
    @direccion_escena NVARCHAR(255),
    @fecha_hora_inicio DATETIME,
    @fecha_hora_fin DATETIME = NULL,
    @descripcion NVARCHAR(MAX) = NULL,
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Escena (id_investigacion, nombre_escena, direccion_escena, fecha_hora_inicio, fecha_hora_fin, descripcion, usuario_creacion)
    VALUES (@id_investigacion, @nombre_escena, @direccion_escena, @fecha_hora_inicio, @fecha_hora_fin, @descripcion, @usuario_creacion);
    SELECT * FROM Escena WHERE id_escena = SCOPE_IDENTITY();
END
GO

-- READ (Find All by Investigacion)
IF OBJECT_ID('sp_Escena_FindByInvestigacion', 'P') IS NOT NULL DROP PROCEDURE sp_Escena_FindByInvestigacion;
GO
CREATE PROCEDURE sp_Escena_FindByInvestigacion
    @id_investigacion INT,
    @activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Escena 
    WHERE id_investigacion = @id_investigacion AND activo = ISNULL(@activo, activo)
    ORDER BY fecha_hora_inicio DESC;
END
GO

-- READ (Find By ID)
IF OBJECT_ID('sp_Escena_FindById', 'P') IS NOT NULL DROP PROCEDURE sp_Escena_FindById;
GO
CREATE PROCEDURE sp_Escena_FindById
    @id_escena INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Escena WHERE id_escena = @id_escena;
END
GO

-- UPDATE
IF OBJECT_ID('sp_Escena_Update', 'P') IS NOT NULL DROP PROCEDURE sp_Escena_Update;
GO
CREATE PROCEDURE sp_Escena_Update
    @id_escena INT,
    @nombre_escena NVARCHAR(150) = NULL,
    @direccion_escena NVARCHAR(255) = NULL,
    @fecha_hora_inicio DATETIME = NULL,
    @fecha_hora_fin DATETIME = NULL,
    @descripcion NVARCHAR(MAX) = NULL,
    @activo BIT = NULL,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Escena
    SET 
        nombre_escena = ISNULL(@nombre_escena, nombre_escena),
        direccion_escena = ISNULL(@direccion_escena, direccion_escena),
        fecha_hora_inicio = ISNULL(@fecha_hora_inicio, fecha_hora_inicio),
        fecha_hora_fin = @fecha_hora_fin, -- Permite actualizar a NULL
        descripcion = ISNULL(@descripcion, descripcion),
        activo = ISNULL(@activo, activo),
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_escena = @id_escena;
END
GO

-- DELETE (Lógico)
IF OBJECT_ID('sp_Escena_Delete', 'P') IS NOT NULL DROP PROCEDURE sp_Escena_Delete;
GO
CREATE PROCEDURE sp_Escena_Delete
    @id_escena INT,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Escena
    SET 
        activo = 0,
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_escena = @id_escena;
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - TIPOINDICIO (CRUD)
-- =============================================

-- CREATE
IF OBJECT_ID('sp_TipoIndicio_Create', 'P') IS NOT NULL DROP PROCEDURE sp_TipoIndicio_Create;
GO
CREATE PROCEDURE sp_TipoIndicio_Create
    @nombre_tipo NVARCHAR(100),
    @descripcion NVARCHAR(255) = NULL,
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO TipoIndicio (nombre_tipo, descripcion, usuario_creacion)
    VALUES (@nombre_tipo, @descripcion, @usuario_creacion);
    SELECT * FROM TipoIndicio WHERE id_tipo_indicio = SCOPE_IDENTITY();
END
GO

-- READ (Find All)
IF OBJECT_ID('sp_TipoIndicio_FindAll', 'P') IS NOT NULL DROP PROCEDURE sp_TipoIndicio_FindAll;
GO
CREATE PROCEDURE sp_TipoIndicio_FindAll
    @activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @activo IS NULL
        SELECT * FROM TipoIndicio ORDER BY nombre_tipo;
    ELSE
        SELECT * FROM TipoIndicio WHERE activo = @activo ORDER BY nombre_tipo;
END
GO

-- READ (Find By ID)
IF OBJECT_ID('sp_TipoIndicio_FindById', 'P') IS NOT NULL DROP PROCEDURE sp_TipoIndicio_FindById;
GO
CREATE PROCEDURE sp_TipoIndicio_FindById
    @id_tipo_indicio INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM TipoIndicio WHERE id_tipo_indicio = @id_tipo_indicio;
END
GO

-- UPDATE
IF OBJECT_ID('sp_TipoIndicio_Update', 'P') IS NOT NULL DROP PROCEDURE sp_TipoIndicio_Update;
GO
CREATE PROCEDURE sp_TipoIndicio_Update
    @id_tipo_indicio INT,
    @nombre_tipo NVARCHAR(100) = NULL,
    @descripcion NVARCHAR(255) = NULL,
    @activo BIT = NULL,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE TipoIndicio
    SET 
        nombre_tipo = ISNULL(@nombre_tipo, nombre_tipo),
        descripcion = ISNULL(@descripcion, descripcion),
        activo = ISNULL(@activo, activo),
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_tipo_indicio = @id_tipo_indicio;
END
GO

-- DELETE (Lógico)
IF OBJECT_ID('sp_TipoIndicio_Delete', 'P') IS NOT NULL DROP PROCEDURE sp_TipoIndicio_Delete;
GO
CREATE PROCEDURE sp_TipoIndicio_Delete
    @id_tipo_indicio INT,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE TipoIndicio
    SET 
        activo = 0,
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_tipo_indicio = @id_tipo_indicio;
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - ESTADOCADENA (CRUD)
-- =============================================

-- CREATE
IF OBJECT_ID('sp_EstadoCadena_Create', 'P') IS NOT NULL DROP PROCEDURE sp_EstadoCadena_Create;
GO
CREATE PROCEDURE sp_EstadoCadena_Create
    @nombre_estado NVARCHAR(100),
    @descripcion NVARCHAR(255) = NULL,
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO EstadoCadena (nombre_estado, descripcion, usuario_creacion)
    VALUES (@nombre_estado, @descripcion, @usuario_creacion);
    SELECT * FROM EstadoCadena WHERE id_estado_cadena = SCOPE_IDENTITY();
END
GO

-- READ (Find All)
IF OBJECT_ID('sp_EstadoCadena_FindAll', 'P') IS NOT NULL DROP PROCEDURE sp_EstadoCadena_FindAll;
GO
CREATE PROCEDURE sp_EstadoCadena_FindAll
    @activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @activo IS NULL
        SELECT * FROM EstadoCadena ORDER BY nombre_estado;
    ELSE
        SELECT * FROM EstadoCadena WHERE activo = @activo ORDER BY nombre_estado;
END
GO

-- READ (Find By ID)
IF OBJECT_ID('sp_EstadoCadena_FindById', 'P') IS NOT NULL DROP PROCEDURE sp_EstadoCadena_FindById;
GO
CREATE PROCEDURE sp_EstadoCadena_FindById
    @id_estado_cadena INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM EstadoCadena WHERE id_estado_cadena = @id_estado_cadena;
END
GO

-- UPDATE
IF OBJECT_ID('sp_EstadoCadena_Update', 'P') IS NOT NULL DROP PROCEDURE sp_EstadoCadena_Update;
GO
CREATE PROCEDURE sp_EstadoCadena_Update
    @id_estado_cadena INT,
    @nombre_estado NVARCHAR(100) = NULL,
    @descripcion NVARCHAR(255) = NULL,
    @activo BIT = NULL,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE EstadoCadena
    SET 
        nombre_estado = ISNULL(@nombre_estado, nombre_estado),
        descripcion = ISNULL(@descripcion, descripcion),
        activo = ISNULL(@activo, activo),
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_estado_cadena = @id_estado_cadena;
END
GO

-- DELETE (Lógico)
IF OBJECT_ID('sp_EstadoCadena_Delete', 'P') IS NOT NULL DROP PROCEDURE sp_EstadoCadena_Delete;
GO
CREATE PROCEDURE sp_EstadoCadena_Delete
    @id_estado_cadena INT,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE EstadoCadena
    SET 
        activo = 0,
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_estado_cadena = @id_estado_cadena;
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - INDICIO (CRUD + Busqueda)
-- =============================================

-- READ (Find By ID - Detalle completo)
IF OBJECT_ID('sp_Indicio_FindById', 'P') IS NOT NULL DROP PROCEDURE sp_Indicio_FindById;
GO
CREATE PROCEDURE sp_Indicio_FindById
    @id_indicio INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        i.id_indicio, i.codigo_indicio, i.descripcion_corta, i.ubicacion_especifica, i.fecha_hora_recoleccion, i.estado_actual, i.activo,
        t.nombre_tipo AS tipo_indicio, 
        e.nombre_escena, e.direccion_escena,
        inv.codigo_caso, inv.nombre_caso,
        f.nombre_fiscalia,
        u_rec.nombre AS recolector_nombre, u_rec.apellido AS recolector_apellido
    FROM Indicio i
    INNER JOIN TipoIndicio t ON i.id_tipo_indicio = t.id_tipo_indicio
    INNER JOIN Escena e ON i.id_escena = e.id_escena
    INNER JOIN Investigacion inv ON e.id_investigacion = inv.id_investigacion
    INNER JOIN Fiscalia f ON inv.id_fiscalia = f.id_fiscalia
    INNER JOIN Usuario u_rec ON i.id_usuario_recolector = u_rec.id_usuario
    WHERE i.id_indicio = @id_indicio;
END
GO

-- CREATE
IF OBJECT_ID('sp_Indicio_Create', 'P') IS NOT NULL DROP PROCEDURE sp_Indicio_Create;
GO
CREATE PROCEDURE sp_Indicio_Create
    @codigo_indicio NVARCHAR(50),
    @id_escena INT,
    @id_tipo_indicio INT,
    @descripcion_corta NVARCHAR(255),
    @ubicacion_especifica NVARCHAR(100) = NULL,
    @fecha_hora_recoleccion DATETIME,
    @id_usuario_recolector INT,
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @id_indicio INT;
    DECLARE @id_estado_inicial INT;
    DECLARE @nombre_estado_inicial NVARCHAR(50) = 'RECOLECTADO'; -- Estado inicial por defecto

    -- Asegurar que el estado inicial exista
    SELECT @id_estado_inicial = id_estado_cadena FROM EstadoCadena WHERE nombre_estado = @nombre_estado_inicial AND activo = 1;
    
    IF @id_estado_inicial IS NULL
    BEGIN
        -- Esto es para el caso de que no se haya precargado el estado, aunque se recomienda precargarlo
        RAISERROR('El estado inicial de cadena de custodia "RECOLECTADO" no existe.', 16, 1);
        RETURN;
    END

    -- 1. Insertar el Indicio
    INSERT INTO Indicio (codigo_indicio, id_escena, id_tipo_indicio, descripcion_corta, ubicacion_especifica, fecha_hora_recoleccion, id_usuario_recolector, estado_actual, usuario_creacion)
    VALUES (@codigo_indicio, @id_escena, @id_tipo_indicio, @descripcion_corta, @ubicacion_especifica, @fecha_hora_recoleccion, @id_usuario_recolector, @nombre_estado_inicial, @usuario_creacion);
    
    SET @id_indicio = SCOPE_IDENTITY();

    -- 2. Insertar el primer registro en CadenaCustodia (RECOLECTADO)
    INSERT INTO CadenaCustodia (id_indicio, id_estado_cadena, fecha_movimiento, id_usuario_responsable, observaciones, usuario_creacion)
    VALUES (@id_indicio, @id_estado_inicial, @fecha_hora_recoleccion, @id_usuario_recolector, 'Indicio recolectado en escena.', @usuario_creacion);

    -- 3. Devolver el Indicio creado
    EXEC sp_Indicio_FindById @id_indicio;
END
GO

-- READ (Find All/List - Busqueda)
IF OBJECT_ID('sp_Indicio_FindAll', 'P') IS NOT NULL DROP PROCEDURE sp_Indicio_FindAll;
GO
CREATE PROCEDURE sp_Indicio_FindAll
    @codigo_caso NVARCHAR(50) = NULL,
    @id_fiscalia INT = NULL,
    @estado_actual NVARCHAR(50) = NULL,
    @activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        i.id_indicio, i.codigo_indicio, i.descripcion_corta, i.estado_actual, i.fecha_hora_recoleccion,
        t.nombre_tipo AS tipo_indicio, 
        inv.codigo_caso, inv.nombre_caso
    FROM Indicio i
    INNER JOIN TipoIndicio t ON i.id_tipo_indicio = t.id_tipo_indicio
    INNER JOIN Escena e ON i.id_escena = e.id_escena
    INNER JOIN Investigacion inv ON e.id_investigacion = inv.id_investigacion
    WHERE 
        i.activo = ISNULL(@activo, i.activo)
        AND (@codigo_caso IS NULL OR inv.codigo_caso LIKE '%' + @codigo_caso + '%')
        AND (@id_fiscalia IS NULL OR inv.id_fiscalia = @id_fiscalia)
        AND (@estado_actual IS NULL OR i.estado_actual = @estado_actual)
    ORDER BY i.fecha_hora_recoleccion DESC;
END
GO

-- UPDATE
IF OBJECT_ID('sp_Indicio_Update', 'P') IS NOT NULL DROP PROCEDURE sp_Indicio_Update;
GO
CREATE PROCEDURE sp_Indicio_Update
    @id_indicio INT,
    @descripcion_corta NVARCHAR(255) = NULL,
    @ubicacion_especifica NVARCHAR(100) = NULL,
    @activo BIT = NULL,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Indicio
    SET 
        descripcion_corta = ISNULL(@descripcion_corta, descripcion_corta),
        ubicacion_especifica = ISNULL(@ubicacion_especifica, ubicacion_especifica),
        activo = ISNULL(@activo, activo),
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_indicio = @id_indicio;
END
GO

-- DELETE (Lógico)
IF OBJECT_ID('sp_Indicio_Delete', 'P') IS NOT NULL DROP PROCEDURE sp_Indicio_Delete;
GO
CREATE PROCEDURE sp_Indicio_Delete
    @id_indicio INT,
    @usuario_actualizacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Indicio
    SET 
        activo = 0,
        usuario_actualizacion = @usuario_actualizacion,
        fecha_actualizacion = GETDATE()
    WHERE id_indicio = @id_indicio;
END
GO


-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - CADENACUSTODIA
-- =============================================

-- CREATE (Movimiento de Cadena de Custodia)
IF OBJECT_ID('sp_CadenaCustodia_Move', 'P') IS NOT NULL DROP PROCEDURE sp_CadenaCustodia_Move;
GO
CREATE PROCEDURE sp_CadenaCustodia_Move
    @id_indicio INT,
    @id_estado_cadena INT,
    @id_usuario_responsable INT,
    @observaciones NVARCHAR(MAX) = NULL,
    @documento_referencia NVARCHAR(100) = NULL,
    @usuario_creacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @nombre_nuevo_estado NVARCHAR(100);

    -- 1. Obtener el nombre del nuevo estado
    SELECT @nombre_nuevo_estado = nombre_estado FROM EstadoCadena WHERE id_estado_cadena = @id_estado_cadena AND activo = 1;

    IF @nombre_nuevo_estado IS NULL
    BEGIN
        RAISERROR('El estado de cadena de custodia seleccionado no es válido o está inactivo.', 16, 1);
        RETURN;
    END

    -- 2. Insertar el registro de movimiento en CadenaCustodia
    INSERT INTO CadenaCustodia (id_indicio, id_estado_cadena, id_usuario_responsable, observaciones, documento_referencia, usuario_creacion)
    VALUES (@id_indicio, @id_estado_cadena, @id_usuario_responsable, @observaciones, @documento_referencia, @usuario_creacion);

    -- 3. Actualizar el estado actual en la tabla Indicio
    UPDATE Indicio
    SET 
        estado_actual = @nombre_nuevo_estado,
        usuario_actualizacion = @usuario_creacion,
        fecha_actualizacion = GETDATE()
    WHERE id_indicio = @id_indicio;

    -- 4. Devolver el registro de la Cadena de Custodia
    SELECT * FROM CadenaCustodia WHERE id_cadena_custodia = SCOPE_IDENTITY();
END
GO

-- READ (Historial por Indicio)
IF OBJECT_ID('sp_CadenaCustodia_FindByIndicio', 'P') IS NOT NULL DROP PROCEDURE sp_CadenaCustodia_FindByIndicio;
GO
CREATE PROCEDURE sp_CadenaCustodia_FindByIndicio
    @id_indicio INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        cc.id_cadena_custodia, cc.fecha_movimiento, cc.observaciones, cc.documento_referencia,
        es.nombre_estado,
        u.nombre AS responsable_nombre, u.apellido AS responsable_apellido
    FROM CadenaCustodia cc
    INNER JOIN EstadoCadena es ON cc.id_estado_cadena = es.id_estado_cadena
    INNER JOIN Usuario u ON cc.id_usuario_responsable = u.id_usuario
    WHERE cc.id_indicio = @id_indicio
    ORDER BY cc.fecha_movimiento ASC;
END
GO

PRINT 'Script DDL de tablas de negocio y procedimientos almacenados (CRUD) ejecutado exitosamente';
GO