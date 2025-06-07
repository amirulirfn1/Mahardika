# 🔒 Security Guide - Mahardika Platform

## Overview

Comprehensive security implementation for the Mahardika platform monorepo, focusing on environment
variables, secrets management, and sensitive data protection with navy #0D1B2A and gold #F4B400
branding.

## 🛡️ Environment Variables & Secrets Management

### .gitignore Security Rules

Our `.gitignore` file includes comprehensive protection for:

#### Environment Files

```bash
# All environment variations
.env*                    # Wildcard for any .env file
.env                     # Base environment file
.env.local              # Local development
.env.development        # Development environment
.env.development.local  # Local development overrides
.env.test               # Test environment
.env.test.local         # Local test overrides
.env.production         # Production environment
.env.production.local   # Local production overrides
.env.staging            # Staging environment
.env.staging.local      # Local staging overrides
```

#### API Keys and Secrets

```bash
# Secret directories and files
secrets/                # Any secrets directory
*.key                   # Private keys
*.pem                   # Certificate files
*.p12                   # PKCS#12 certificates
*.crt                   # Certificate files
*.csr                   # Certificate signing requests
*.pfx                   # Personal Exchange files
.secret                 # Hidden secret files
.secrets               # Hidden secrets directory
secrets.json           # JSON secrets files
secrets.yaml           # YAML secrets files
secrets.yml            # YML secrets files
config/secrets/        # Configuration secrets
keys/                  # Keys directory
certificates/          # Certificates directory
```

#### Authentication & Tokens

```bash
# Authentication files
.auth                   # Auth configuration
auth.json              # Authentication JSON
token.json             # Token files
tokens/                # Tokens directory
.firebase/             # Firebase config
.vercel/env            # Vercel environment
.netlify/              # Netlify config
.aws/                  # AWS credentials
.gcp/                  # Google Cloud config
```

#### Database & Infrastructure

```bash
# Database credentials
database.env           # Database environment
db.env                 # DB environment
db-credentials.*       # Any DB credential files

# Cloud & Infrastructure
terraform.tfvars       # Terraform variables
*.tfvars.json         # Terraform JSON vars
.terraform/           # Terraform state
terraform.tfstate*    # Terraform state files
.aws/credentials      # AWS credentials
.aws/config          # AWS config
.azure/              # Azure config
.gcloud/             # Google Cloud config
.kube/config         # Kubernetes config
```

## 🔐 Mahardika Environment Configuration

### Environment Template (.env.local.example)

```bash
# Mahardika Platform Environment Variables
# Copy this file to .env.local and fill in your values

# API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here
NEXT_PUBLIC_APP_NAME=Mahardika Platform
NEXT_PUBLIC_APP_VERSION=1.0.0

# Brand Colors (for dynamic theming)
NEXT_PUBLIC_BRAND_NAVY=#0D1B2A
NEXT_PUBLIC_BRAND_GOLD=#F4B400

# Database (if using)
# DATABASE_URL=your_database_url_here
# DATABASE_PASSWORD=your_secure_password

# Authentication (if implementing)
# NEXTAUTH_SECRET=your_nextauth_secret
# NEXTAUTH_URL=http://localhost:3000

# External Services
# STRIPE_SECRET_KEY=sk_test_your_stripe_key
# SENDGRID_API_KEY=your_sendgrid_key

# Analytics (if implementing)
# GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
# MIXPANEL_TOKEN=your_mixpanel_token

# Feature Flags
# ENABLE_AI_CHAT=true
# ENABLE_ANALYTICS=false
# DEBUG_MODE=false
```

### Development Environment Setup

```bash
# 1. Copy environment template
cp .env.local.example .env.local

# 2. Fill in your actual values (never commit this file)
# Edit .env.local with your actual API keys and secrets

# 3. Verify .env.local is ignored
git status # Should not show .env.local
```

## 🔍 Security Verification

### Pre-Commit Security Checks

```bash
# Check for accidentally committed secrets
git log --all -p | grep -i "api_key\|secret\|password\|token"

# Verify .env files are ignored
git status | grep -E "\.env"

# Check for large files that might contain secrets
find . -type f -size +10M -not -path "./node_modules/*"

# Scan for potential secrets in staged files
git diff --cached | grep -i -E "(password|secret|key|token|api)"
```

### Security Testing Script

Create `scripts/security-check.js`:

```javascript
#!/usr/bin/env node
/**
 * Security check script for Mahardika Platform
 * Verifies no secrets are accidentally committed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mahardika brand colors for output
const colors = {
  navy: '\x1b[38;2;13;27;42m',
  gold: '\x1b[38;2;244;180;0m',
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
};

console.log(`${colors.navy}🔒 Mahardika Security Check${colors.reset}`);
console.log(`${colors.gold}Scanning for potential security issues...${colors.reset}\n`);

// Check for .env files in git
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  const envFiles = gitStatus.split('\n').filter(line => line.includes('.env'));

  if (envFiles.length > 0) {
    console.log(`${colors.red}❌ Environment files found in git status:${colors.reset}`);
    envFiles.forEach(file => console.log(`   ${file}`));
    process.exit(1);
  }
} catch (error) {
  console.log(`${colors.gold}⚠️  Not a git repository or git not available${colors.reset}`);
}

// Check for secrets in staged files
try {
  const diff = execSync('git diff --cached', { encoding: 'utf8' });
  const secretPatterns = [
    /api[_-]?key[s]?\s*[:=]\s*['"']?[a-zA-Z0-9_-]{20,}['"']?/gi,
    /secret[_-]?key[s]?\s*[:=]\s*['"']?[a-zA-Z0-9_-]{20,}['"']?/gi,
    /password[s]?\s*[:=]\s*['"']?[a-zA-Z0-9_-]{8,}['"']?/gi,
    /token[s]?\s*[:=]\s*['"']?[a-zA-Z0-9_-]{20,}['"']?/gi,
  ];

  let foundSecrets = false;
  secretPatterns.forEach(pattern => {
    const matches = diff.match(pattern);
    if (matches) {
      foundSecrets = true;
      console.log(`${colors.red}❌ Potential secrets found in staged files:${colors.reset}`);
      matches.forEach(match => console.log(`   ${match}`));
    }
  });

  if (foundSecrets) {
    console.log(`\n${colors.red}Please remove secrets before committing!${colors.reset}`);
    process.exit(1);
  }
} catch (error) {
  // No staged files or git error
}

// Verify .env.local.example exists
if (!fs.existsSync('.env.local.example')) {
  console.log(`${colors.red}❌ .env.local.example template missing${colors.reset}`);
  process.exit(1);
}

// Verify .gitignore includes .env*
const gitignore = fs.readFileSync('.gitignore', 'utf8');
if (!gitignore.includes('.env*')) {
  console.log(`${colors.red}❌ .gitignore missing .env* wildcard${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.green}✅ Security check passed!${colors.reset}`);
console.log(`${colors.navy}All environment files and secrets properly protected${colors.reset}`);
```

## 🚀 Deployment Security

### Vercel Environment Variables

```bash
# Set environment variables in Vercel dashboard
DEEPSEEK_API_KEY=your_production_api_key
NEXT_PUBLIC_BRAND_NAVY=#0D1B2A
NEXT_PUBLIC_BRAND_GOLD=#F4B400

# Or via Vercel CLI
vercel env add DEEPSEEK_API_KEY production
vercel env add NEXT_PUBLIC_BRAND_NAVY production
vercel env add NEXT_PUBLIC_BRAND_GOLD production
```

### GitHub Secrets

```yaml
# .github/workflows/deploy.yml
name: Deploy Mahardika Platform
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: pnpm install
      - name: Run security check
        run: node scripts/security-check.js
      - name: Build
        run: pnpm run build
        env:
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
          NEXT_PUBLIC_BRAND_NAVY: '#0D1B2A'
          NEXT_PUBLIC_BRAND_GOLD: '#F4B400'
```

## 📋 Security Checklist

### Development

- [ ] `.env.local.example` template created
- [ ] `.env*` files in `.gitignore`
- [ ] No hardcoded secrets in source code
- [ ] Environment variables properly typed
- [ ] Security check script implemented

### Pre-Commit

- [ ] Run security check script
- [ ] Verify no `.env` files staged
- [ ] Check for hardcoded secrets
- [ ] Validate environment template is up to date

### Deployment

- [ ] Environment variables set in deployment platform
- [ ] No secrets in build logs
- [ ] API keys have proper scoping
- [ ] Production secrets differ from development

### Monitoring

- [ ] Set up secret scanning in repository
- [ ] Monitor for leaked credentials
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning

## 🔧 Tools and Scripts

### NPM Scripts (add to package.json)

```json
{
  "scripts": {
    "security:check": "node scripts/security-check.js",
    "security:scan": "git log --all -p | grep -i 'api_key\\|secret\\|password\\|token' || echo 'No secrets found'",
    "env:template": "cp .env.local.example .env.local",
    "pre-commit": "pnpm run security:check && pnpm run build && pnpm run test"
  }
}
```

### Git Hooks

```bash
#!/bin/sh
# .git/hooks/pre-commit
echo "🔒 Running Mahardika security checks..."
pnpm run security:check
if [ $? -ne 0 ]; then
  echo "❌ Security check failed. Commit aborted."
  exit 1
fi
echo "✅ Security check passed"
```

## 🎨 Brand-Consistent Security

### UI Components for Environment Display

```typescript
// SecurityStatus.tsx - Component showing environment security
import { colors } from "@mahardika/ui";

export interface SecurityStatusProps {
  isSecure: boolean;
  environment: string;
}

export const SecurityStatus: React.FC<SecurityStatusProps> = ({
  isSecure,
  environment,
}) => {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.5rem",
        backgroundColor: isSecure ? colors.navy : colors.gray[800],
        border: `2px solid ${isSecure ? colors.gold : colors.gray[600]}`,
        color: colors.text.primary,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.5rem" }}>{isSecure ? "🔒" : "⚠️"}</span>
        <span style={{ color: isSecure ? colors.gold : colors.gray[300] }}>
          Environment: {environment}
        </span>
      </div>
      <p
        style={{
          margin: "0.5rem 0 0 0",
          fontSize: "0.875rem",
          color: colors.text.secondary,
        }}
      >
        {isSecure
          ? "All secrets properly configured and protected"
          : "Security configuration requires attention"}
      </p>
    </div>
  );
};
```

---

**Security Status**: 🔒 Protected  
**Brand Colors**: Navy #0D1B2A • Gold #F4B400  
**Last Updated**: Environment security implementation
