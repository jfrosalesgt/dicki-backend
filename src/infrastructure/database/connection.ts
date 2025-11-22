import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'dicri-indicios',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

class Database {
  private static instance: Database;
  private pool: sql.ConnectionPool | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<sql.ConnectionPool> {
    if (this.pool && this.pool.connected) {
      return this.pool;
    }

    try {
      this.pool = await sql.connect(config);
      console.log('✅ Conexión a SQL Server establecida');
      return this.pool;
    } catch (error) {
      console.error('❌ Error al conectar con SQL Server:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        console.log('🔌 Conexión a SQL Server cerrada');
      }
    } catch (error) {
      console.error('❌ Error al cerrar conexión con SQL Server:', error);
      throw error;
    }
  }

  public getPool(): sql.ConnectionPool {
    if (!this.pool || !this.pool.connected) {
      throw new Error('La base de datos no está conectada');
    }
    return this.pool;
  }
}

export default Database;
