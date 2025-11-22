import crypto from 'crypto';

export class CryptoUtils {
  /**
   * Genera hash MD5 de un string
   */
  static md5Hash(text: string): string {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  /**
   * Compara un texto plano con su hash MD5
   */
  static compareMd5(plainText: string, hashedText: string): boolean {
    const hash = this.md5Hash(plainText);
    return hash === hashedText;
  }
}
