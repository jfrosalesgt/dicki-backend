import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  database: {
    server: string;
    port: number;
    user: string;
    password: string;
    database: string;
    encrypt: boolean;
    trustServerCertificate: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433'),
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'dicri-indicios',
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};

export default config;
