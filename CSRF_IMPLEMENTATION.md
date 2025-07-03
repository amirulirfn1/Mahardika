# 🔒 CSRF Protection Implementation Guide

## Overview

This document explains the Cross-Site Request Forgery (CSRF) protection implementation in the Mahardika platform. CSRF protection prevents malicious websites from making unauthorized requests on behalf of authenticated users.

## 🚀 Quick Start

### For Developers

1. **API Routes**: Wrap your POST/PUT/PATCH/DELETE handlers with `csrfProtection()`
2. **Components**: Use the `useCSRF()` hook for client-side requests
3. **Environment**: Set `CSRF_SECRET_KEY` in your environment variables

### Example Usage

```typescript
// API Route (src/app/api/example/route.ts)
import { csrfProtection } from '@/lib/csrf';

async function handleCreate(request: NextRequest) {
  // Your API logic here
  return NextResponse.json({ success: true });
}

export const POST = csrfProtection(handleCreate);
```

```typescript
// React Component
import { useCSRF } from '@/lib/hooks/useCSRF';

function MyComponent() {
  const { addToFetchOptions } = useCSRF();
  
  const submitData = async () => {
    await fetch('/api/example', addToFetchOptions({
      method: 'POST',
      body: JSON.stringify(data)
    }));
  };
}
```

## 📁 File Structure

```
src/lib/
├── csrf.ts                    # Core CSRF utilities
└── hooks/useCSRF.ts          # React hook for CSRF tokens

src/components/
└── CSRFTestComponent.tsx     # Testing component (dev only)

middleware.ts                 # Main middleware (updated)
```

## 🔧 Implementation Details

### Core Functions

| Function | Purpose |
|----------|---------|
| `csrfProtection()` | Middleware wrapper for API routes |
| `useCSRF()` | React hook for client-side requests |
| `handleCSRFForPages()` | Middleware for setting tokens on pages |

### Configuration

```typescript
const CSRF_CONFIG = {
  secretKey: process.env.CSRF_SECRET_KEY || process.env.NEXTAUTH_SECRET,
  tokenLength: 32,
  cookieName: 'csrf-token',
  headerName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
  },
};
```

## 🛡️ Security Features

### Automatic Protection
- ✅ Double-submit cookie pattern
- ✅ HMAC-signed tokens
- ✅ Automatic token rotation
- ✅ Secure cookie attributes
- ✅ Path-based exemptions

### Exempt Routes
The following routes are automatically exempt from CSRF protection:
- `/api/auth/*` - Authentication endpoints
- `/api/cron/*` - Cron jobs
- `/auth/*` - Auth pages
- `/_next/*` - Next.js internals
- `/favicon.ico` - Static assets

### Protected Methods
CSRF protection is applied to these HTTP methods:
- `POST`
- `PUT` 
- `PATCH`
- `DELETE`

## 📝 Migration Guide

### Updating Existing API Routes

**Before:**
```typescript
export async function POST(request: NextRequest) {
  // API logic
}
```

**After:**
```typescript
import { csrfProtection } from '@/lib/csrf';

async function handlePost(request: NextRequest) {
  // API logic
}

export const POST = csrfProtection(handlePost);
```

### Updating React Components

**Before:**
```typescript
const response = await fetch('/api/data', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

**After:**
```typescript
import { useCSRF } from '@/lib/hooks/useCSRF';

function MyComponent() {
  const { addToFetchOptions } = useCSRF();
  
  const response = await fetch('/api/data', addToFetchOptions({
    method: 'POST',
    body: JSON.stringify(data)
  }));
}
```

## 🧪 Testing

### Manual Testing
Add the CSRF test component to any page:

```typescript
import CSRFTestComponent from '@/components/CSRFTestComponent';

export default function TestPage() {
  return <CSRFTestComponent />;
}
```

### Expected Behavior
- ✅ Requests with valid CSRF tokens succeed
- ❌ Requests without CSRF tokens are blocked (403)
- ❌ Requests with invalid CSRF tokens are blocked (403)

### Error Codes
| Code | Description |
|------|-------------|
| `CSRF_TOKEN_MISSING` | No CSRF token provided |
| `CSRF_TOKEN_INVALID` | Token signature is invalid |
| `CSRF_TOKEN_MISMATCH` | Cookie and header tokens don't match |

## 🔑 Environment Setup

Add to your `.env.local`:

```bash
# CSRF Protection Secret Key
CSRF_SECRET_KEY=your-super-secret-csrf-key-at-least-32-characters-long

# Alternative: Uses existing NextAuth secret if CSRF_SECRET_KEY not set
# NEXTAUTH_SECRET=your-nextauth-secret
```

## 🚨 Troubleshooting

### Common Issues

**1. "CSRF token missing" errors**
- Ensure `useCSRF()` hook is used in components
- Check that middleware is properly configured
- Verify the component is rendered client-side

**2. "CSRF token invalid" errors**
- Check that `CSRF_SECRET_KEY` is consistent across deployments
- Ensure cookies are being set properly
- Verify secure attribute matches environment (HTTP vs HTTPS)

**3. Middleware errors**
- Check Next.js version compatibility
- Ensure middleware file is in the root directory
- Verify import paths are correct

### Debug Mode

Set `NODE_ENV=development` to enable debug logging:

```typescript
// In components
const { token, isLoading } = useCSRF();
console.log('CSRF Token:', token ? 'Available' : 'Missing');
```

## 📚 References

### Security Standards
- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Double Submit Cookie Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie)

### Implementation Details
- Uses double-submit cookie pattern for stateless validation
- HMAC-SHA256 for token signing
- Automatic token refresh on page load
- Graceful degradation for development environments

## 🔄 Future Enhancements

### Planned Improvements
- [ ] Rate limiting integration
- [ ] Token rotation policies
- [ ] CSP integration
- [ ] Automated testing suite
- [ ] Performance monitoring

### Configuration Options
```typescript
// Future configuration expansion
const ADVANCED_CSRF_CONFIG = {
  rotateOnSuspiciousActivity: true,
  integrationWithRateLimit: true,
  customExemptionRules: [],
  tokenRotationInterval: '1h',
};
```

---

**⚠️ Important Notes:**
- Remove `CSRFTestComponent` from production builds
- Ensure `CSRF_SECRET_KEY` is properly configured in production
- Monitor CSRF-related errors in production logs
- Test thoroughly after any middleware changes 