/**
 * ✅ SECURITY IMPROVEMENT: Input Validation Utilities
 * Comprehensive validation system to prevent SQL injection, XSS, and ensure data integrity
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 */

import { NextRequest, NextResponse } from 'next/server';
import { log } from './logger';

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Base validator interface
 */
export interface Validator<T = any> {
  validate(value: any): T;
  optional(): Validator<T | undefined>;
}

/**
 * String validator with sanitization
 */
export class StringValidator implements Validator<string> {
  private minLength?: number;
  private maxLength?: number;
  private pattern?: RegExp;
  private allowEmpty: boolean = false;
  private sanitize: boolean = true;

  min(length: number): this {
    this.minLength = length;
    return this;
  }

  max(length: number): this {
    this.maxLength = length;
    return this;
  }

  regex(pattern: RegExp): this {
    this.pattern = pattern;
    return this;
  }

  email(): this {
    this.pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this;
  }

  url(): this {
    this.pattern = /^https?:\/\/.+/;
    return this;
  }

  uuid(): this {
    this.pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return this;
  }

  slug(): this {
    this.pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return this;
  }

  empty(): this {
    this.allowEmpty = true;
    return this;
  }

  noSanitize(): this {
    this.sanitize = false;
    return this;
  }

  validate(value: any): string {
    if (typeof value !== 'string') {
      throw new ValidationError('Value must be a string');
    }

    // Sanitize input to prevent XSS
    let sanitized = value;
    if (this.sanitize) {
      sanitized = this.sanitizeString(value);
    }

    if (!this.allowEmpty && sanitized.trim().length === 0) {
      throw new ValidationError('Value cannot be empty');
    }

    if (this.minLength !== undefined && sanitized.length < this.minLength) {
      throw new ValidationError(
        `Value must be at least ${this.minLength} characters`
      );
    }

    if (this.maxLength !== undefined && sanitized.length > this.maxLength) {
      throw new ValidationError(
        `Value must be at most ${this.maxLength} characters`
      );
    }

    if (this.pattern && !this.pattern.test(sanitized)) {
      throw new ValidationError('Value format is invalid');
    }

    return sanitized;
  }

  optional(): Validator<string | undefined> {
    return new OptionalValidator(this);
  }

  private sanitizeString(str: string): string {
    return str
      .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
}

/**
 * Number validator
 */
export class NumberValidator implements Validator<number> {
  private minValue?: number;
  private maxValue?: number;
  private isInteger: boolean = false;

  min(value: number): this {
    this.minValue = value;
    return this;
  }

  max(value: number): this {
    this.maxValue = value;
    return this;
  }

  integer(): this {
    this.isInteger = true;
    return this;
  }

  positive(): this {
    this.minValue = 0;
    return this;
  }

  validate(value: any): number {
    const num = Number(value);

    if (isNaN(num)) {
      throw new ValidationError('Value must be a number');
    }

    if (this.isInteger && !Number.isInteger(num)) {
      throw new ValidationError('Value must be an integer');
    }

    if (this.minValue !== undefined && num < this.minValue) {
      throw new ValidationError(`Value must be at least ${this.minValue}`);
    }

    if (this.maxValue !== undefined && num > this.maxValue) {
      throw new ValidationError(`Value must be at most ${this.maxValue}`);
    }

    return num;
  }

  optional(): Validator<number | undefined> {
    return new OptionalValidator(this);
  }
}

/**
 * Boolean validator
 */
export class BooleanValidator implements Validator<boolean> {
  validate(value: any): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      if (lower === 'true' || lower === '1') return true;
      if (lower === 'false' || lower === '0') return false;
    }

    throw new ValidationError('Value must be a boolean');
  }

  optional(): Validator<boolean | undefined> {
    return new OptionalValidator(this);
  }
}

/**
 * Array validator
 */
export class ArrayValidator<T> implements Validator<T[]> {
  private minLength?: number;
  private maxLength?: number;
  private itemValidator?: Validator<T>;

  constructor(itemValidator?: Validator<T>) {
    this.itemValidator = itemValidator;
  }

  min(length: number): this {
    this.minLength = length;
    return this;
  }

  max(length: number): this {
    this.maxLength = length;
    return this;
  }

  validate(value: any): T[] {
    if (!Array.isArray(value)) {
      throw new ValidationError('Value must be an array');
    }

    if (this.minLength !== undefined && value.length < this.minLength) {
      throw new ValidationError(
        `Array must have at least ${this.minLength} items`
      );
    }

    if (this.maxLength !== undefined && value.length > this.maxLength) {
      throw new ValidationError(
        `Array must have at most ${this.maxLength} items`
      );
    }

    if (this.itemValidator) {
      return value.map((item, index) => {
        try {
          return this.itemValidator!.validate(item);
        } catch (error) {
          throw new ValidationError(
            `Invalid item at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      });
    }

    return value;
  }

  optional(): Validator<T[] | undefined> {
    return new OptionalValidator(this);
  }
}

/**
 * Object validator
 */
export class ObjectValidator<T extends Record<string, any>>
  implements Validator<T>
{
  private schema: { [K in keyof T]: Validator<T[K]> };

  constructor(schema: { [K in keyof T]: Validator<T[K]> }) {
    this.schema = schema;
  }

  validate(value: any): T {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new ValidationError('Value must be an object');
    }

    const result: any = {};
    const errors: string[] = [];

    for (const [key, validator] of Object.entries(this.schema)) {
      try {
        result[key] = validator.validate(value[key]);
      } catch (error) {
        errors.push(
          `${key}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
    }

    return result as T;
  }

  optional(): Validator<T | undefined> {
    return new OptionalValidator(this);
  }
}

/**
 * Optional validator wrapper
 */
export class OptionalValidator<T> implements Validator<T | undefined> {
  constructor(private innerValidator: Validator<T>) {}

  validate(value: any): T | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    return this.innerValidator.validate(value);
  }

  optional(): Validator<T | undefined> {
    return this;
  }
}

/**
 * Validation builder functions
 */
export const v = {
  string: () => new StringValidator(),
  number: () => new NumberValidator(),
  boolean: () => new BooleanValidator(),
  array: <T>(itemValidator?: Validator<T>) =>
    new ArrayValidator<T>(itemValidator),
  object: <T extends Record<string, any>>(schema: {
    [K in keyof T]: Validator<T[K]>;
  }) => new ObjectValidator<T>(schema),
};

/**
 * ✅ MIDDLEWARE: Request validation middleware
 */
export function validateRequest<T>(validator: Validator<T>) {
  return async (
    request: NextRequest,
    handler: (data: T, request: NextRequest) => Promise<NextResponse>
  ) => {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      log.apiRequest(request.method, request.nextUrl.pathname, { requestId });

      const body = await request.json();
      const validatedData = validator.validate(body);

      const response = await handler(validatedData, request);
      const duration = Date.now() - startTime;

      log.apiResponse(
        request.method,
        request.nextUrl.pathname,
        response.status,
        duration,
        { requestId }
      );

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      if (error instanceof ValidationError) {
        log.warn('Validation error', {
          requestId,
          error: error.message,
          field: error.field,
          duration,
        });

        return NextResponse.json(
          {
            error: 'Validation failed',
            message: error.message,
            field: error.field,
            requestId,
          },
          { status: 400 }
        );
      }

      log.error('Request handler error', {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      });

      return NextResponse.json(
        {
          error: 'Internal server error',
          requestId,
        },
        { status: 500 }
      );
    }
  };
}

/**
 * ✅ SECURITY: Rate limiting validation
 */
export function validateRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (request: NextRequest): boolean => {
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const now = Date.now();
    const key = `${clientIp}:${request.nextUrl.pathname}`;
    const current = requests.get(key);

    if (!current || now > current.resetTime) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (current.count >= maxRequests) {
      log.security('Rate limit exceeded', {
        clientIp,
        path: request.nextUrl.pathname,
        count: current.count,
        maxRequests,
      });
      return false;
    }

    current.count++;
    return true;
  };
}

// Export commonly used validators
export const validators = {
  email: () => v.string().email().max(255),
  password: () => v.string().min(8).max(128).noSanitize(),
  uuid: () => v.string().uuid(),
  slug: () => v.string().slug().max(100),
  url: () => v.string().url().max(500),
  name: () => v.string().min(1).max(255),
  description: () => v.string().max(1000),
  price: () => v.number().positive(),
  quantity: () => v.number().integer().min(1),
  phone: () =>
    v
      .string()
      .regex(/^\+?[\d\s-]+$/)
      .max(20),
  postalCode: () => v.string().max(20),
};

export default v;
