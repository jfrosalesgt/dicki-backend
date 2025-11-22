import App from './app';
import config from './config/config';
import Database from './infrastructure/database/connection';

const startServer = async (): Promise<void> => {
  try {
    // Conectar a la base de datos
    console.log('🔌 Conectando a la base de datos...');
    const db = Database.getInstance();
    await db.connect();

    // Inicializar aplicación
    const app = new App();

    // Iniciar servidor
    const server = app.app.listen(config.port, () => {
      console.log('=================================');
      console.log(`🚀 Servidor iniciado correctamente`);
      console.log(`📡 Puerto: ${config.port}`);
      console.log(`🌍 Entorno: ${config.nodeEnv}`);
      console.log(`🗄️  Base de datos: ${config.database.database}`);
      console.log(`🔗 URL: http://localhost:${config.port}`);
      console.log('=================================');
    });

    // Manejo de señales para cierre graceful
    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`\n${signal} recibido. Cerrando servidor...`);
      
      server.close(async () => {
        console.log('✅ Servidor HTTP cerrado');
        
        try {
          await db.disconnect();
          console.log('✅ Conexión a base de datos cerrada');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error al cerrar conexión a base de datos:', error);
          process.exit(1);
        }
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error('⚠️ Forzando cierre del servidor');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de terminación
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Manejo de errores no capturados
    process.on('unhandledRejection', (reason: any) => {
      console.error('❌ Unhandled Rejection:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

    process.on('uncaughtException', (error: Error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
