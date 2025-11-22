import jwt, { SignOptions, Secret, TokenExpiredError } from 'jsonwebtoken';
import config from '../../config/config';
import { ApiError } from './ApiError';

export interface JwtPayload {
  id_usuario: number;
  nombre_usuario: string;
  email: string;
  perfiles: number[];
  roles: string[];
  modulos: number[];
}

export class JwtUtils {
  static generateToken(payload: JwtPayload): string {
    const secret: Secret = config.jwt.secret as Secret;
    const options: SignOptions = { expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'] };
    return jwt.sign(payload, secret, options);
  }

  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret as Secret) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw ApiError.unauthorized('Token expirado');
      }
      throw ApiError.unauthorized('Token inválido');
    }
  }
}
