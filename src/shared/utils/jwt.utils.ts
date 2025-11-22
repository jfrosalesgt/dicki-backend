import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id_usuario: number;
  nombre_usuario: string;
  email: string;
  perfiles: number[];
  roles: string[];
}

export class JwtUtils {
  private static SECRET = process.env.JWT_SECRET || 'default-secret-key';
  private static EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

  /**
   * Genera un token JWT
   */
  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.SECRET, {
      expiresIn: this.EXPIRES_IN,
    } as jwt.SignOptions);
  }

  /**
   * Verifica y decodifica un token JWT
   */
  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.SECRET) as JwtPayload;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Decodifica un token sin verificar (útil para depuración)
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
