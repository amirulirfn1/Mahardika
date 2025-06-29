import { colors } from "@mahardika/ui";
/**
 * ✅ SECURITY & MONITORING IMPROVEMENT: Structured Logging Utility
 * Replaces console.* calls with proper logging that doesn't expose sensitive data
 * Brand Colors: Navy colors.navy, Gold colors.gold
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  service: string;
  requestId?: string;
  userId?: string;
  agencyId?: string;
}

/**
 * Structured logger class for Mahardika Platform
 */
export class MahardikaLogger {
  private serviceName: string;
  private isDevelopment: boolean;

  constructor(serviceName: string = 'mahardika-web') {
    this.serviceName = serviceName;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Creates a log entry with proper structure
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.sanitizeContext(context),
      service: this.serviceName,
      requestId: context?.requestId,
      userId: context?.userId,
      agencyId: context?.agencyId,
    };
  }

  /**
   * ✅ SECURITY: Sanitize context to remove sensitive data
   */
  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    const sanitized = { ...context };

    // Remove sensitive fields
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
      'session',
      'apiKey',
      'privateKey',
      'accessToken',
      'refreshToken',
    ];

    const sanitizeObject = (obj: any): any => {
      if (obj === null || typeof obj !== 'object') return obj;

      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }

      const sanitizedObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
          sanitizedObj[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          sanitizedObj[key] = sanitizeObject(value);
        } else {
          sanitizedObj[key] = value;
        }
      }
      return sanitizedObj;
    };

    return sanitizeObject(sanitized);
  }

  /**
   * Format log entry for console output in development
   */
  private formatForConsole(entry: LogEntry): string {
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m', // Green
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      reset: '\x1b[0m',
    };

    const levelColor = colors[entry.level] || colors.reset;
    const prefix = `${levelColor}[${entry.level.toUpperCase()}]${colors.reset}`;
    const timestamp = entry.timestamp.split('T')[1].split('.')[0];

    let output = `${prefix} ${timestamp} ${entry.message}`;

    if (entry.context && Object.keys(entry.context).length > 0) {
      output += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
    }

    return output;
  }

  /**
   * Output log entry
   */
  private output(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Pretty console output in development
      
    } else {
      // Structured JSON output in production
      
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.output(this.createLogEntry('debug', message, context));
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    this.output(this.createLogEntry('info', message, context));
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext): void {
    this.output(this.createLogEntry('warn', message, context));
  }

  /**
   * Error level logging
   */
  error(message: string, context?: LogContext): void {
    this.output(this.createLogEntry('error', message, context));
  }

  /**
   * API request logging
   */
  apiRequest(method: string, path: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${path}`, {
      method,
      path,
      ...context,
    });
  }

  /**
   * API response logging
   */
  apiResponse(
    method: string,
    path: string,
    status: number,
    duration?: number,
    context?: LogContext
  ): void {
    let level: LogLevel = 'info';
    if (status >= 400) {
      level = 'error';
    } else if (status >= 300) {
      level = 'warn';
    }
    this[level](`API Response: ${method} ${path} - ${status}`, {
      method,
      path,
      status,
      duration,
      ...context,
    });
  }

  /**
   * Database operation logging
   */
  dbOperation(operation: string, table: string, context?: LogContext): void {
    this.debug(`DB Operation: ${operation} on ${table}`, {
      operation,
      table,
      ...context,
    });
  }

  /**
   * Authentication logging
   */
  auth(event: string, context?: LogContext): void {
    this.info(`Auth Event: ${event}`, context);
  }

  /**
   * Security event logging
   */
  security(event: string, context?: LogContext): void {
    this.warn(`Security Event: ${event}`, context);
  }

  /**
   * Performance logging
   */
  performance(operation: string, duration: number, context?: LogContext): void {
    const level = duration > 5000 ? 'warn' : 'info';
    this[level](`Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      ...context,
    });
  }
}

// Create default logger instance
export const logger = new MahardikaLogger();

// Create specialized loggers for different services
export const createLogger = (serviceName: string) =>
  new MahardikaLogger(serviceName);

// Export convenience functions
export const log = {
  debug: (message: string, context?: LogContext) =>
    logger.debug(message, context),
  info: (message: string, context?: LogContext) =>
    logger.info(message, context),
  warn: (message: string, context?: LogContext) =>
    logger.warn(message, context),
  error: (message: string, context?: LogContext) =>
    logger.error(message, context),
  apiRequest: (method: string, path: string, context?: LogContext) =>
    logger.apiRequest(method, path, context),
  apiResponse: (
    method: string,
    path: string,
    status: number,
    duration?: number,
    context?: LogContext
  ) => logger.apiResponse(method, path, status, duration, context),
  auth: (event: string, context?: LogContext) => logger.auth(event, context),
  security: (event: string, context?: LogContext) =>
    logger.security(event, context),
  performance: (operation: string, duration: number, context?: LogContext) =>
    logger.performance(operation, duration, context),
};

export default logger;
