# Project Pages and Functions Overview

This document provides a comprehensive list of all pages and functions in the insurance management platform project.

## 📄 Pages (Next.js App Router)

### 🏠 Main Pages
- **HomePage** (`/`) - Main landing page
- **AuthPage** (`/auth`) - Authentication hub
- **ShopPage** (`/shop`) - Insurance products shop
- **MarketplacePage** (`/marketplace`) - Insurance marketplace
- **AgenciesPage** (`/agencies`) - Agency directory
- **BrandShowcasePage** (`/brand-showcase`) - Brand showcase
- **PrivacyPolicy** (`/privacy`) - Privacy policy page
- **TermsPage** (`/terms`) - Terms of service

### 🔐 Authentication Pages
- **SignInPage** (`/auth/sign-in`) - User sign in
- **SignUpPage** (`/auth/sign-up`) - User registration hub
- **AgencySignUpPage** (`/auth/sign-up/agency`) - Agency registration
- **CustomerSignUpPage** (`/auth/sign-up/customer`) - Customer registration
- **ForgotPasswordPage** (`/auth/forgot-password`) - Password recovery
- **ResetPasswordPage** (`/auth/reset-password`) - Password reset
- **AuthCallbackPage** (`/auth/callback`) - Authentication callback

### 🏢 Agency Pages
- **DashboardPage** (`/agency/dashboard`) - Agency dashboard

### 📊 Dashboard Pages
- **PaymentAdminPage** (`/dashboard/payments`) - Payment administration
- **PoliciesPage** (`/dashboard/policies`) - Policy management
- **NewPolicyPage** (`/dashboard/policies/new`) - Create new policy
- **VehiclesDashboardPage** (`/dashboard/vehicles`) - Vehicle management
- **EditVehiclePage** (`/dashboard/vehicles/[id]/edit`) - Edit vehicle

### 👥 Customer Pages
- **CustomerPoliciesPage** (`/customer/policies`) - Customer policy view

### 👨‍💼 Staff Pages
- **StaffDashboardPage** (`/staff/dashboard`) - Staff dashboard

### 🛍️ Shop Pages
- **ShopSlugPage** (`/shop/[slug]`) - Individual shop page

### 🧪 Demo Pages
- **UploadDemoPage** (`/demo/upload`) - File upload demo

## 🔗 API Routes (50 total)

### 🔐 Authentication API
- `/api/auth/signup` - User registration
- `/api/auth/callback` - Auth callback handling

### 💬 Communication API
- `/api/chat` - Chat functionality
- `/api/ai/usage` - AI usage tracking

### 🏢 Business Logic API
- `/api/orders` - Order management
- `/api/checkout` - Checkout processing
- `/api/policies` - Policy operations
- `/api/vehicles` - Vehicle management
- `/api/customers` - Customer operations
- `/api/customers/[id]/quotations` - Customer quotations
- `/api/users/create` - User creation

### 💳 Payment API
- `/api/payments/proof` - Payment proof upload
- `/api/points/redeem` - Points redemption

### 📁 File Management API
- `/api/uploadPDF` - PDF file uploads
- `/api/compressUpload` - File compression and upload

### ⏰ Cron/Scheduled API
- `/api/cron/updateClamSig` - Antivirus signature updates
- `/api/cron/pdfLifecycle` - PDF lifecycle management

## 🧩 React Components

### 🎨 UI Components
- **Navigation** - Main navigation component
- **Footer** - Site footer
- **LayoutShell** - Layout wrapper
- **TierBadge** - User tier display
- **LoadingSkeleton** - Loading state component
- **ErrorBoundary** - Error handling component
- **ErrorPage** - Error display page

### 📋 Form Components
- **AuthForm** - Authentication forms
- **PolicyForm** - Policy creation/editing
- **AddVehicleModal** - Vehicle addition modal
- **StarRatingForm** - Rating submission
- **CheckoutWizard** - Checkout flow
- **PolicyWizard** - Policy creation wizard

### 📊 Business Components
- **InsuranceDashboard** - Main dashboard
- **AgencyGrid** - Agency listing
- **ShopPage** - Shop interface
- **TokenUsageCard** - AI token usage display
- **CustomerLoyaltyCard** - Loyalty program display
- **PointsRedeemDialog** - Points redemption interface

### 📤 Upload Components
- **BossUploadForm** - File upload form
- **HeroImageUploadModal** - Image upload modal
- **UploadProofModal** - Payment proof upload

### 💬 Interactive Components
- **AiMessageModal** - AI chat interface
- **ReviewReplyInterface** - Review management
- **SettingsMenu** - User settings

### 🧪 Development Components
- **CSRFTestComponent** - CSRF testing

## 🛠️ Utility Functions

### 🔐 Authentication & Security
- **signInAction** - User sign in
- **signOutAction** - User sign out
- **getCurrentUserAction** - Get current user
- **checkAuthAction** - Check authentication status
- **redirectToDashboardAction** - Dashboard redirect
- **handleAuthError** - Authentication error handling
- **useCSRF** - CSRF protection hook

### 🏢 Agency Management
- **validateAgencyData** - Agency data validation
- **validateSlugFormat** - URL slug validation
- **generateSlugFromName** - Slug generation
- **isSlugAvailable** - Check slug availability
- **generateUniqueSlug** - Generate unique slug
- **getAgencyById** - Get agency by ID
- **getAgencyBySlug** - Get agency by slug
- **getAgencyProfile** - Get agency profile
- **searchAgencies** - Search agencies
- **createAgency** - Create new agency
- **updateAgency** - Update agency
- **formatAgencyForDisplay** - Format agency data
- **calculateAgencyStats** - Calculate statistics

### 📊 AI & Usage Tracking
- **checkAiUsage** - Check AI usage limits
- **logAiUsage** - Log AI usage
- **getMonthlyUsageStats** - Get usage statistics
- **estimateTokens** - Estimate token count
- **getUpgradeMessage** - Generate upgrade messages

### 📁 File Management
- **validateFile** - File validation
- **generateSecureFileName** - Secure filename generation
- **uploadToStorage** - File upload to storage
- **getSignedFileUrl** - Get signed URLs
- **scanFileForViruses** - Antivirus scanning
- **compressPDF** - PDF compression
- **generateKpiPdf** - Generate KPI reports
- **generateTestPdf** - Generate test PDFs

### 🗃️ Database Operations
- **connectToDatabase** - Database connection
- **disconnectFromDatabase** - Database disconnection
- **checkDatabaseHealth** - Health check
- **createTenantContext** - Multi-tenant context
- **createAgencyClient** - Agency-specific client
- **logDatabaseActivity** - Activity logging

### 🔍 Validation & Error Handling
- **validateRequest** - Request validation
- **validateRateLimit** - Rate limiting
- **validateRequiredFields** - Field validation
- **validateEmail** - Email validation
- **validateUUID** - UUID validation
- **apiErrorHandler** - API error handling

### 💳 Payment & Points
- **handlePointsRedeem** - Points redemption
- **createReferralWallet** - Referral system
- **processReferral** - Process referrals
- **withdrawFromWallet** - Wallet withdrawals
- **getReferralDashboard** - Referral dashboard

### 📱 Communication
- **sendText** - WhatsApp text messages
- **sendTemplate** - WhatsApp templates
- **generateEmailTemplate** - Email template generation
- **sendWhatsAppMessage** - WhatsApp messaging

### ⚙️ Configuration & Environment
- **isSupabaseConfigured** - Check Supabase config
- **checkRateLimit** - Rate limiting checks

### 🧪 Testing & Development
- **simulateVirusScan** - Simulate antivirus scan
- **simulatePDFCompression** - Simulate PDF compression

## 📊 Background Jobs & Cron Functions

### 📈 Reporting
- **calculateAgencyKpis** - Calculate agency KPIs
- **generateKpiReports** - Generate KPI reports
- **uploadReportToStorage** - Upload reports

### 🔄 Maintenance
- **processRenewalReminders** - Process policy renewals
- **runLifecycleCleanup** - File lifecycle cleanup
- **updateSignatures** - Update antivirus signatures

### 🗃️ Database Management
- **disableRLS** - Disable row-level security
- **enableRLS** - Enable row-level security
- **createRLSManagementFunctions** - RLS function creation
- **seedDatabase** - Database seeding

## 🎨 Styling & Theming
- **ThemeContext** - Theme management context

## 🌐 Internationalization
- **i18n** configuration and utilities

---

**Total Summary:**
- **25+ Pages** across authentication, dashboard, shop, and admin areas
- **50+ API Routes** for comprehensive backend functionality
- **100+ Functions** covering business logic, utilities, and integrations
- **20+ React Components** for UI and interactive features
- **Multiple Background Jobs** for automated tasks and maintenance

This is a comprehensive insurance management platform with multi-tenant agency support, customer management, policy administration, payment processing, and AI-powered features.