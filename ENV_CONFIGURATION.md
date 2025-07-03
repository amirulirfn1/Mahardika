# 🔐 Environment Configuration & Secret Management - Mahardika Platform

## Brand Colors

- **Navy Primary**: `#0D1B2A`
- **Gold Accent**: `#F4B400`

## 🎯 Overview

This document outlines the manual secret management strategy for the Mahardika Platform, ensuring
sensitive keys are stored securely in Vercel environment variables and local `.env` files only.

## 🔑 Secret Management Strategy

### Core Principles

1. **Never commit secrets to version control**
2. **Use Vercel environment variables for production**
3. **Use local `.env.local` for development**
4. **Implement proper secret rotation policies**

## 📋 Environment Variables Classification

### 🔒 **SENSITIVE (Never commit)**

These must ONLY exist in Vercel environment variables and local `.env.local`:

```bash
# API Keys & Secrets
DEEPSEEK_API_KEY=sk-xxxxx
NEXTAUTH_SECRET=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
STRIPE_SECRET_KEY=sk_xxxxx

# Security & Protection
CSRF_SECRET_KEY=xxxxx-32-char-minimum

# Database Credentials
DATABASE_PASSWORD=xxxxx
SUPABASE_DB_PASSWORD=xxxxx

# Third-party Service Keys
RESEND_API_KEY=SG.xxxxx
CLAM_UPDATE_AUTH_TOKEN=xxxxx
PDF_LIFECYCLE_AUTH_TOKEN=xxxxx
```

### 🌐 **PUBLIC (Can be committed)**

These can be in the codebase but prefixed with `NEXT_PUBLIC_`:

```bash
# Public Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
NEXT_PUBLIC_BRAND_NAVY=#0D1B2A
NEXT_PUBLIC_BRAND_GOLD=#F4B400
```

## 🚀 Vercel Environment Variables Setup

### Production Environment

1. Navigate to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add the following variables for **Production**:

```bash
# Required for Production
NODE_ENV=production
NEXTAUTH_SECRET=generate-32-char-secret
CSRF_SECRET_KEY=generate-32-char-csrf-secret
DEEPSEEK_API_KEY=sk-your-production-key

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External Services
STRIPE_SECRET_KEY=sk_live_your-live-key
RESEND_API_KEY=your-production-key
```

### Preview Environment

```bash
# Staging/Preview specific
NODE_ENV=staging
NEXTAUTH_SECRET=staging-secret-32-chars
DEEPSEEK_API_KEY=sk-your-staging-key
# ... other staging-specific values
```

## 🏠 Local Development Setup

### Step 1: Create Local Environment File

```bash
# Copy the example file
cp .env.local.example .env.local
```

### Step 2: Fill in Development Values

Edit `.env.local` with your development values. The `.env.local.example` file contains:

- **All required environment variables** with placeholders
- **Clear categorization** by functionality
- **Security notes** for sensitive variables
- **Generation commands** for secure secrets
- **Validation instructions**

Key sections in `.env.local.example`:

```bash
# Core Application Configuration
NODE_ENV=development
NEXTAUTH_SECRET=your-32-character-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Security & CSRF Protection
CSRF_SECRET_KEY=your-32-character-csrf-secret-key-here

# Brand & UI Configuration (Public)
NEXT_PUBLIC_BRAND_NAVY=#0D1B2A
NEXT_PUBLIC_BRAND_GOLD=#F4B400
NEXT_PUBLIC_APP_NAME=Mahardika

# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# AI & Security
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
ENABLE_VIRUS_SCAN=true
ENABLE_PDF_COMPRESSION=true

# Payment & Email
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
RESEND_API_KEY=your-resend-api-key-here
```

## 🛡️ Security Best Practices

### 1. Secret Generation

```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use openssl
openssl rand -hex 32
```

### 2. Environment Validation

Use our built-in validation in `src/lib/env.ts`:

```typescript
import { validateEnvironment } from '@/lib/env';

// Check for missing required variables
const missing = validateEnvironment();
if (missing.length > 0) {
  console.error('Missing required environment variables:', missing);
}
```

### 3. Git Security

Ensure `.env.local` is in `.gitignore`:

```gitignore
# Environment files
.env.local
.env.*.local
.env.production
.env.staging
```

## 🔄 Secret Rotation Policy

### Monthly Rotation (High Security)

- `NEXTAUTH_SECRET`
- `CSRF_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`

### Quarterly Rotation (Medium Security)

- `DEEPSEEK_API_KEY`
- `RESEND_API_KEY`

### Steps for Secret Rotation:

1. Generate new secret
2. Update Vercel environment variable
3. Update local `.env.local`
4. Test in preview environment
5. Deploy to production
6. Verify functionality
7. Revoke old secret

## 🧪 Testing Environment Variables

### Validation Script

```bash
# Run environment validation
pnpm run env:test
```

### Manual Testing

```typescript
// Test in your application
import env from '@/lib/env';
```

## 📋 Complete Environment Variables Reference

For a complete list of all environment variables with descriptions and examples, see:

- **`.env.local.example`** - Comprehensive template with all variables
- **`src/lib/env.ts`** - Type-safe environment configuration
- **`scripts/env-test.js`** - Environment validation script

### Quick Reference Categories

1. **Core Application**: `NODE_ENV`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
2. **Security & CSRF**: `CSRF_SECRET_KEY`, `ENABLE_VIRUS_SCAN`, `ENABLE_PDF_COMPRESSION`
3. **Brand & UI**: All `NEXT_PUBLIC_BRAND_*` variables
4. **Database**: `DATABASE_URL`, `SUPABASE_*` variables
5. **AI & ML**: `DEEPSEEK_API_KEY`
6. **Rate Limiting**: `RATE_LIMIT_*` variables
7. **Email**: `RESEND_API_KEY`, `EMAIL_FROM`
8. **Payments**: `STRIPE_*` variables
9. **Analytics**: `NEXT_PUBLIC_POSTHOG_*` variables
10. **Development**: `DEBUG_MODE`

## 🚨 Important Notes

- **Always use `.env.local.example` as your starting point**
- **Never commit `.env.local` to version control**
- **Use `NEXT_PUBLIC_` prefix for client-side variables**
- **Validate environment before deployment**
- **Rotate secrets regularly**
- **Use secure secret generation methods**

## 📊 Environment Variable Checklist

### Development Setup ✅

- [ ] `.env.local` created from template
- [ ] All required development keys added
- [ ] Database connections tested
- [ ] Authentication flow tested

### Production Deployment ✅

- [ ] All production secrets added to Vercel
- [ ] Environment variables validated
- [ ] Database connections tested
- [ ] External services tested
- [ ] Error monitoring configured

## 🆘 Troubleshooting

### Common Issues

#### 1. Missing Environment Variables

```bash
Error: Missing required environment variables: ['NEXTAUTH_SECRET']
```

**Solution**: Add the missing variable to Vercel or `.env.local`

#### 2. Invalid Supabase Configuration

```bash
Error: Invalid Supabase URL or key
```

**Solution**: Verify URL format and key validity in Supabase dashboard

#### 3. NextAuth Configuration Issues

```bash
Error: NEXTAUTH_SECRET is not set
```

**Solution**: Generate and set a 32+ character secret

### Emergency Secret Compromise

1. **Immediately revoke** the compromised secret
2. **Generate new secret**
3. **Update all environments** (Vercel + local)
4. **Force re-deployment** to apply changes
5. **Monitor logs** for any unauthorized access

## 📚 Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Environment Setup](https://supabase.com/docs/guides/getting-started/local-development)

## 🎨 Mahardika Branding

Environment variables for consistent branding:

```bash
NEXT_PUBLIC_BRAND_NAVY=#0D1B2A
NEXT_PUBLIC_BRAND_GOLD=#F4B400
NEXT_PUBLIC_APP_NAME=Mahardika Platform
```

---

**Remember**: Security is paramount. When in doubt, treat it as sensitive and store it securely! 🔐
