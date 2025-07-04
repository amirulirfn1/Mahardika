/**
 * =============================================================================
 * Mahardika Platform - Customer Sign Up API Route
 * Handles customer registration with Supabase
 * =============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService, userService, SignUpData } from '@/lib/supabaseClient';
import { csrfProtection } from '@/lib/csrf';
import { validateStrongPassword, StrongPasswordSchema } from '@/lib/passwordSecurity';
import { z } from 'zod';

// Validation schema for sign-up data
const SignUpSchema = z.object({
  email: z.string().email('Valid email required'),
  password: StrongPasswordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  user_type: z.enum(['customer', 'agency']).default('customer'),
});

async function handleSignUp(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = SignUpSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password, name, user_type } = validationResult.data;

    // Additional password security validation
    const passwordValidation = await validateStrongPassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors,
          warnings: passwordValidation.warnings,
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { user: existingUser } = await authService.getCurrentUser();
    if (existingUser && existingUser.email === email) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already exists with this email',
        },
        { status: 409 }
      );
    }

    // Create sign-up data
    const signUpData: SignUpData = {
      email,
      password,
      name,
      user_type,
    };

    // Attempt to sign up the user
    const { user, error } = await authService.signUp(signUpData);

    if (error) {
      console.error('Sign-up error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to create account',
        },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create user account',
        },
        { status: 500 }
      );
    }

    // Create user profile in database
    const profileData = {
      name,
      email,
      user_type,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const { error: profileError } = await userService.upsertProfile(
      user.id,
      profileData
    );

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail the sign-up if profile creation fails
      // The profile can be created later
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
          user_type: user.user_metadata?.user_type,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sign-up API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

// Wrap POST handler with CSRF protection
export const POST = csrfProtection(handleSignUp); 