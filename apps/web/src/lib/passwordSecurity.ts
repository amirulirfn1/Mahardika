/**
 * =============================================================================
 * Mahardika Platform - Password Security
 * Strong password validation and breach checking
 * =============================================================================
 */

import { z } from 'zod';
import { createHash } from 'crypto';

// Strong password policy schema
export const StrongPasswordSchema = z.string()
  .min(12, 'Password must be at least 12 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
  .refine(
    (password) => !/(.)\1{2,}/.test(password),
    'Password must not contain more than 2 consecutive identical characters'
  )
  .refine(
    (password) => !/^(.+)(.+)\1\2/.test(password),
    'Password must not contain obvious patterns'
  );

// Common password patterns to reject
const COMMON_PATTERNS = [
  /password/i,
  /123456/,
  /qwerty/i,
  /admin/i,
  /login/i,
  /welcome/i,
  /mahardika/i,
];

/**
 * Check if password contains common patterns
 */
function hasCommonPatterns(password: string): boolean {
  return COMMON_PATTERNS.some(pattern => pattern.test(password));
}

/**
 * Check if password has been compromised using HaveIBeenPwned API
 */
export async function checkPasswordBreach(password: string): Promise<{ 
  isBreached: boolean; 
  breachCount?: number; 
  error?: string 
}> {
  try {
    // Hash the password with SHA-1
    const hash = createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    // Query HaveIBeenPwned API with k-anonymity
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mahardika-Security-Check'
      },
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      return { 
        isBreached: false, 
        error: `HaveIBeenPwned API error: ${response.status}` 
      };
    }

    const data = await response.text();
    const lines = data.split('\n');
    
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix === suffix) {
        return {
          isBreached: true,
          breachCount: parseInt(count, 10)
        };
      }
    }

    return { isBreached: false };
  } catch (error) {
    console.error('Password breach check failed:', error);
    // Don't block password creation if API is down
    return { 
      isBreached: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Comprehensive password validation
 */
export async function validateStrongPassword(password: string): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic schema validation
  const schemaResult = StrongPasswordSchema.safeParse(password);
  if (!schemaResult.success) {
    errors.push(...schemaResult.error.errors.map(err => err.message));
  }

  // Check for common patterns
  if (hasCommonPatterns(password)) {
    errors.push('Password contains common words or patterns');
  }

  // Check for breach (non-blocking)
  try {
    const breachResult = await checkPasswordBreach(password);
    
    if (breachResult.isBreached) {
      errors.push(
        `This password has been found in ${breachResult.breachCount} data breaches. ` +
        'Please choose a different password.'
      );
    }
    
    if (breachResult.error) {
      warnings.push('Password breach check unavailable - proceeding with other validations');
    }
  } catch (error) {
    warnings.push('Password breach check failed - proceeding with other validations');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Zod schema that includes async breach checking
 */
export function createPasswordSchema() {
  return z.string().superRefine(async (password, ctx) => {
    const validation = await validateStrongPassword(password);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error,
        });
      });
    }
  });
}

/**
 * Password strength meter (0-5 scale)
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  // Length scoring
  if (password.length >= 12) score += 1;
  else feedback.push('Use at least 12 characters');

  if (password.length >= 16) score += 1;
  else if (password.length >= 12) feedback.push('Consider using 16+ characters for better security');

  // Character variety
  if (/[a-z]/.test(password)) score += 0.5;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 0.5;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score += 0.5;
  else feedback.push('Add numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score += 0.5;
  else feedback.push('Add special characters');

  // Pattern checks
  if (!/(.)\1{2,}/.test(password)) score += 0.5;
  else feedback.push('Avoid repeating characters');

  if (!hasCommonPatterns(password)) score += 1;
  else feedback.push('Avoid common words and patterns');

  return {
    score: Math.min(5, score),
    feedback
  };
} 