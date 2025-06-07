# Mahardika Platform Bootstrap

Complete setup automation for the Mahardika Platform development environment with dependency checks,
package installation, and configuration.

## 🚀 Quick Start

### Windows

```bash
pnpm run bootstrap
# or directly
scripts\bootstrap.bat
```

### Linux/macOS/WSL

```bash
pnpm run bootstrap:bash
# or directly
bash scripts/bootstrap.sh
```

## 🎯 What Bootstrap Does

The bootstrap script performs a complete development environment setup:

### 1. **Dependency Verification**

- ✅ **Node.js ≥18.0.0** - Required for all JavaScript/TypeScript operations
- ✅ **pnpm** - Package manager for monorepo workspace management
- ✅ **Supabase CLI** - Database and backend services (auto-installs if missing)
- ✅ **Git** - Version control (recommended but not required)

### 2. **Package Installation**

- Installs all workspace dependencies using `pnpm install`
- Handles monorepo package linking automatically
- Verifies installation success

### 3. **Supabase Setup**

- Initializes Supabase project with `supabase init`
- Starts local development environment with `supabase start`
- Extracts local credentials for environment configuration
- Gracefully handles existing installations

### 4. **Prisma Database Setup**

- Searches for Prisma schemas in common locations:
  - `packages/*/prisma/schema.prisma`
  - `apps/*/prisma/schema.prisma`
  - `prisma/schema.prisma`
- Runs `pnpm dlx prisma migrate dev --name init` for each found schema
- Skips if no Prisma configuration found

### 5. **Environment Configuration**

- Creates comprehensive `.env.local` file with:
  - **Supabase credentials** (auto-extracted from local instance)
  - **Mahardika brand colors** (`#0D1B2A` navy, `#F4B400` gold)
  - **DeepSeek AI API** placeholder
  - **Next.js configuration** variables
  - **Feature flags** and development settings
- Backs up existing `.env.local` files with timestamp
- Verifies `.env.local.example` compatibility

### 6. **Security & Build Verification**

- Runs security check script if available
- Verifies all packages build successfully
- Provides comprehensive setup summary

## 🎨 Mahardika Brand Integration

The bootstrap script uses consistent Mahardika branding:

- **Navy (#0D1B2A)** - Primary brand color for headers and important text
- **Gold (#F4B400)** - Accent color for highlights and success messages
- **Consistent styling** - All output follows brand color scheme
- **Environment variables** - Brand colors included in `.env.local` for dynamic theming

## 📁 Generated Files

### `.env.local`

Complete environment configuration with:

```bash
# Supabase Configuration
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mahardika Brand Colors
NEXT_PUBLIC_BRAND_NAVY=#0D1B2A
NEXT_PUBLIC_BRAND_GOLD=#F4B400

# DeepSeek AI API
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here

# Application Configuration
NEXT_PUBLIC_APP_NAME=Mahardika Platform
NEXT_PUBLIC_ENABLE_AI_CHAT=true
```

### Backup Files

- `.env.local.backup.YYYYMMDD_HHMMSS` - Timestamped backups of existing environment files

## 🔧 Usage Examples

### First-Time Setup

```bash
# Clone repository
git clone https://github.com/amirulirfn1/Mahardika.git
cd Mahardika

# Run bootstrap (Windows)
pnpm run bootstrap

# Start development
pnpm run dev
```

### Existing Project Update

```bash
# Update dependencies and reconfigure
pnpm run bootstrap

# Verify everything works
pnpm run build
pnpm run test
```

### Manual Steps (if bootstrap fails)

```bash
# Install dependencies manually
pnpm install

# Setup Supabase manually
supabase init
supabase start

# Run Prisma migrations manually
pnpm dlx prisma migrate dev --name init

# Create environment file manually
cp .env.local.example .env.local
```

## 🛠️ Troubleshooting

### Common Issues

#### **Node.js Version Error**

```
❌ Node.js 16.x.x found, but ≥18.0.0 required
```

**Solution:** Update Node.js from [nodejs.org](https://nodejs.org/)

#### **pnpm Not Found**

```
❌ pnpm not found
```

**Solution:** Install pnpm globally

```bash
npm install -g pnpm
```

#### **Supabase CLI Installation Failed**

```
❌ Failed to install Supabase CLI
```

**Solution:** Install manually

```bash
npm install -g supabase
# or
npx supabase --version
```

#### **Prisma Migration Failed**

```
⚠️ Prisma migration failed
```

**Solution:** Check database connection and schema

```bash
# Verify Prisma schema exists
ls prisma/schema.prisma

# Run migration manually
pnpm dlx prisma migrate dev --name init
```

#### **Build Verification Failed**

```
⚠️ Build verification failed
```

**Solution:** Check for missing dependencies

```bash
# Install missing dependencies
pnpm install

# Check specific package builds
pnpm run --filter='@mahardika/ui' build
pnpm run --filter='@mahardika/web' build
```

### Environment Issues

#### **Supabase Credentials Not Extracted**

If bootstrap can't extract Supabase credentials:

1. Start Supabase manually: `supabase start`
2. Get credentials: `supabase status`
3. Update `.env.local` manually

#### **DeepSeek API Key Missing**

Update `.env.local` with your actual API key:

```bash
DEEPSEEK_API_KEY=sk-your-actual-deepseek-api-key
```

### Platform-Specific Issues

#### **Windows: Bash Not Found**

Use the batch script version:

```bash
pnpm run bootstrap
# instead of
pnpm run bootstrap:bash
```

#### **Linux/macOS: Permission Denied**

Make script executable:

```bash
chmod +x scripts/bootstrap.sh
bash scripts/bootstrap.sh
```

## 🔍 Verification Commands

After bootstrap completion, verify setup:

```bash
# Check all dependencies
node --version    # Should be ≥18.0.0
pnpm --version    # Should be installed
supabase --version # Should be installed

# Check Supabase status
supabase status

# Verify builds
pnpm run build

# Run tests
pnpm run test

# Check security
pnpm run security:check
```

## 📚 Next Steps After Bootstrap

1. **Update Environment Variables**

   - Add your actual Supabase project credentials
   - Add your DeepSeek API key
   - Configure any additional services

2. **Start Development**

   ```bash
   pnpm run dev
   ```

3. **Visit Your Application**

   - Web app: http://localhost:3000
   - Supabase Studio: http://localhost:54323

4. **Explore the Codebase**
   - UI Components: `packages/ui/src/`
   - Web Application: `apps/web/src/`
   - Tests: `packages/ui/src/__tests__/`

## 🔗 Resources

- **Repository:** https://github.com/amirulirfn1/Mahardika.git
- **Supabase Dashboard:** https://app.supabase.com
- **DeepSeek API:** https://platform.deepseek.com
- **Node.js:** https://nodejs.org/
- **pnpm:** https://pnpm.io/

## 🎨 Brand Colors

- **Navy:** `#0D1B2A` - Primary brand color
- **Gold:** `#F4B400` - Accent brand color

These colors are automatically included in your environment configuration and can be used throughout
your application for consistent theming.

---

**Happy coding with Mahardika Platform! 🚀**
