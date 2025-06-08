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

# Database Credentials
DATABASE_PASSWORD=xxxxx
SUPABASE_DB_PASSWORD=xxxxx

# Third-party Service Keys
SENDGRID_API_KEY=SG.xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
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
DEEPSEEK_API_KEY=sk-your-production-key

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External Services
STRIPE_SECRET_KEY=sk_live_your-live-key
SENDGRID_API_KEY=SG.your-production-key
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

Edit `.env.local` with your development values:

```bash
# Development Environment
NODE_ENV=development
NEXTAUTH_SECRET=dev-secret-min-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# Development API Keys
DEEPSEEK_API_KEY=sk-your-dev-key-here

# Supabase Development
SUPABASE_URL=https://your-dev-project.supabase.co
SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-key

# Public Development Config
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
NEXT_PUBLIC_BRAND_NAVY=#0D1B2A
NEXT_PUBLIC_BRAND_GOLD=#F4B400
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
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`

### Quarterly Rotation (Medium Security)

- `DEEPSEEK_API_KEY`
- `SENDGRID_API_KEY`

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

console.log('Environment Summary:', env.getEnvironmentSummary());
```

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
