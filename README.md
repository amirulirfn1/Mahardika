# Mahardika v1 - Insurance Policy Management Platform

**Internal insurance platform built with Next.js 14 + Supabase**

🔗 **Live Demo**: [mahardika-six.vercel.app](https://mahardika-six.vercel.app)
📊 **Repository**: [github.com/amirulirfn1/Mahardika](https://github.com/amirulirfn1/Mahardika)

## 🚀 Quick Start

### Automated Setup (Windows)

```bash
# Run the setup script
scripts/setup.bat
```

### Manual Setup

#### 1. Prerequisites

- Node.js 18+ and pnpm 9+
- Git
- Supabase account
- Vercel account

#### 2. Installation

```bash
# Install dependencies
pnpm install

# Install CLI tools
npm install -g vercel
```

#### 3. Supabase Setup

```bash
# Login to Supabase
npx supabase login

# Create new project or link existing
npx supabase link --project-ref YOUR_PROJECT_REF

# Push database schema
npx supabase db push

# Deploy Edge Functions
npx supabase functions deploy
```

#### 4. Environment Configuration

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### 5. Vercel Deployment

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel deploy --prod
```

## 🛠️ Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run tests
pnpm run test

# Type checking
pnpm run type-check
```

## 📦 Deployment

### Automated Deployment

```bash
# Run complete deployment pipeline
scripts/deploy.bat
```

### Manual Deployment Steps

1. **Build**: `pnpm run build`
2. **Database**: `npx supabase db push`
3. **Functions**: `npx supabase functions deploy`
4. **Frontend**: `vercel deploy --prod`

## 🔧 CI/CD Setup

Add these secrets to your GitHub repository:

| Secret                          | Description                        |
| ------------------------------- | ---------------------------------- |
| `SUPABASE_PROJECT_REF`          | Your Supabase project reference ID |
| `SUPABASE_ACCESS_TOKEN`         | Supabase personal access token     |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key             |
| `VERCEL_TOKEN`                  | Vercel deployment token            |
| `VERCEL_ORG_ID`                 | Vercel organization ID             |
| `VERCEL_PROJECT_ID`             | Vercel project ID                  |

## 🏗️ Architecture

```
mahardika-admin/
├── apps/
│   ├── web/                 # Next.js 14 frontend
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   └── lib/           # Utilities & config
│   └── functions/         # Supabase Edge Functions
│       └── renewal-reminder/
├── supabase/
│   └── migrations/        # Database schema
├── scripts/               # Deployment scripts
└── .github/workflows/     # CI/CD pipelines
```

## 🔑 Key Features

### Phase 1 (Current)

- ✅ **Authentication**: Email + Google OAuth
- ✅ **Database**: PostgreSQL with RLS policies
- ✅ **Role Management**: Admin/Agent/Customer roles
- ✅ **Policy Management**: CRUD operations
- ✅ **Vehicle Registry**: Comprehensive vehicle data
- ✅ **Payment Tracking**: Invoice and payment history
- ✅ **Loyalty System**: Points calculation & rewards
- ✅ **Automated Notifications**: Email + WhatsApp reminders
- ✅ **Edge Functions**: Renewal reminder system
- ✅ **CI/CD**: GitHub Actions deployment

### Upcoming Features

- 📱 **Mobile App**: React Native implementation
- 📊 **Analytics Dashboard**: Business intelligence
- 🤖 **AI Assistant**: Policy recommendations
- 📄 **Document Management**: Automated processing
- 💳 **Payment Gateway**: Multiple payment options

## 🗄️ Database Schema

### Core Tables

- **policies**: Insurance policy records
- **vehicles**: Vehicle information registry
- **payments**: Payment and invoice tracking
- **loyalty_points**: Customer loyalty system
- **profiles**: User profile management

### Security

- Row Level Security (RLS) enabled
- Role-based access control
- API rate limiting
- Data encryption at rest

## 🔗 External Integrations

- **Supabase**: Backend-as-a-Service
- **Vercel**: Frontend deployment
- **GitHub Actions**: CI/CD pipeline
- **WhatsApp API**: Automated messaging
- **Email Service**: Renewal notifications

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, SEO, Best Practices)
- **Core Web Vitals**: Optimized for all metrics
- **Database**: Sub-100ms query response times
- **CDN**: Global edge caching via Vercel

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📧 Email: support@mahardika.com
- 🐛 Issues: [GitHub Issues](https://github.com/amirulirfn1/Mahardika/issues)
- 📖 Documentation: [Wiki](https://github.com/amirulirfn1/Mahardika/wiki)

---

**Built with ❤️ for the Indonesian insurance industry**
