/**
 * Logger utility para la aplicación
 * Proporciona logs con colores y timestamps
 */

enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.getTimestamp();
    const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  info(message: string, data?: any): void {
    console.log(`ℹ️  ${this.formatMessage(LogLevel.INFO, message, data)}`);
  }

  success(message: string, data?: any): void {
    console.log(`✅ ${this.formatMessage(LogLevel.SUCCESS, message, data)}`);
  }

  warning(message: string, data?: any): void {
    console.warn(`⚠️  ${this.formatMessage(LogLevel.WARNING, message, data)}`);
  }

  error(message: string, error?: any): void {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    console.error(`❌ ${this.formatMessage(LogLevel.ERROR, message, errorData)}`);
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(`🐛 ${this.formatMessage(LogLevel.DEBUG, message, data)}`);
    }
  }
}

export const logger = new Logger();
