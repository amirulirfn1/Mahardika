/**
 * =============================================================================
 * Mahardika Platform - Customer Sign Up API Route
 * Handles customer registration with Supabase
 * =============================================================================
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { authService, userService, SignUpData } from '@/lib/supabaseClient';
import { csrfProtection } from '@mah/core/security/csrf';
import {
  validateStrongPassword,
  StrongPasswordSchema,
} from '@mah/core/security/passwordSecurity';
import { z } from 'zod';

// Validation schema for sign-up data
const SignUpSchema = z.object({
  email: z.string().email('Valid email required'),
  password: StrongPasswordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  user_type: z.enum(['customer', 'agency']).default('customer'),
});

async function handleSignUp(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse and validate request body
    const { body } = req;
    const validationResult = SignUpSchema.safeParse(body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { email, password, name, user_type } = validationResult.data;

    // Validate password strength
    const passwordValidation = validateStrongPassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Password validation failed',
        details: passwordValidation.errors,
      });
    }

    // Create user account
    const signUpData: SignUpData = {
      email,
      password,
      name,
      user_type,
    };

    const result = await authService.signUp(signUpData);

    if (result.error) {
      console.error('Sign up error:', result.error);

      // Handle specific error cases
      if (result.error.message?.includes('User already registered')) {
        return res.status(409).json({
          error: 'Email already registered',
          message: 'An account with this email already exists.',
        });
      }

      return res.status(400).json({
        error: 'Sign up failed',
        message: result.error.message || 'Unable to create account',
      });
    }

    // Success response
    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: result.data?.user?.id,
        email: result.data?.user?.email,
        name: result.data?.user?.user_metadata?.name,
        user_type: result.data?.user?.user_metadata?.user_type,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);

    // Handle specific error types
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred during sign up',
    });
  }
}

// Wrap handler with CSRF protection
export default csrfProtection(handleSignUp);
