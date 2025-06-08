# Supabase Password Reset Setup - Mahardika Platform

**Brand Colors: Navy #0D1B2A, Gold #F4B400**

## Overview

This document provides the complete implementation for adding password reset redirect URI in
Supabase for the Mahardika Platform.

## 1. Supabase Dashboard Configuration

### Step 1: Access Authentication Settings

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your Mahardika Platform project
3. Navigate to **Authentication** → **Settings**

### Step 2: Configure Redirect URLs

In the **Site URL** section, add the following redirect URLs:

```
# Production URLs
https://yourdomain.com/auth/reset-password

# Development URLs
http://localhost:3000/auth/reset-password
http://127.0.0.1:3000/auth/reset-password
```

### Step 3: Email Template Configuration

1. Go to **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. Replace the default template with the custom Mahardika template:

```html
<!-- Use the content from apps/web/email-templates/password-reset.html -->
```

## 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Custom redirect URL (optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Code Implementation

### Supabase Client Configuration

The Supabase client is configured in `apps/web/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export const resetPassword = async (email: string, redirectTo?: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
```

### Password Reset Flow

1. **Forgot Password Page**: `apps/web/src/app/auth/forgot-password/page.tsx`

   - User enters email address
   - Calls `resetPassword()` function
   - Shows success message

2. **Reset Password Page**: `apps/web/src/app/auth/reset-password/page.tsx`

   - Handles the redirect from email link
   - Allows user to set new password
   - Calls `updatePassword()` function

3. **Email Template**: `apps/web/email-templates/password-reset.html`
   - Custom branded email template
   - Uses Mahardika colors (Navy #0D1B2A, Gold #F4B400)
   - Responsive design

## 4. Security Considerations

### Rate Limiting

Supabase automatically implements rate limiting for password reset requests:

- Maximum 4 requests per hour per IP address
- Maximum 1 request per minute per email address

### Link Expiration

- Password reset links expire after 24 hours
- Links can only be used once

### HTTPS Requirements

- All redirect URLs must use HTTPS in production
- HTTP is only allowed for localhost development

## 5. Testing the Implementation

### Local Development Testing

1. Start the development server:

```bash
cd apps/web
npm run dev
```

2. Navigate to `http://localhost:3000/auth/forgot-password`

3. Enter a valid email address

4. Check your email for the reset link

5. Click the link to test the reset flow

### Production Testing

1. Deploy your application to your hosting platform

2. Update the Supabase redirect URLs with your production domain

3. Test the complete flow in production environment

## 6. Troubleshooting

### Common Issues

**Error: "Invalid redirect URL"**

- Ensure the redirect URL is added to Supabase dashboard
- Check that URLs match exactly (including protocol)

**Error: "Email not sent"**

- Verify SMTP settings in Supabase
- Check email rate limits
- Ensure email address exists in your user table

**Error: "Invalid reset link"**

- Check if link has expired (24 hours)
- Verify the link hasn't been used already
- Ensure correct environment variables

### Debug Mode

Enable debug logging by adding to your environment:

```bash
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## 7. Email Provider Configuration

### Default Supabase SMTP

Supabase provides basic SMTP for development. For production, configure custom SMTP:

1. Go to **Settings** → **Authentication**
2. Scroll to **SMTP Settings**
3. Configure your email provider (SendGrid, AWS SES, etc.)

### Custom SMTP Example

```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Pass: your_sendgrid_api_key
```

## 8. Monitoring and Analytics

### Authentication Events

Monitor password reset events in Supabase:

1. Go to **Authentication** → **Logs**
2. Filter by event type: `password_recovery`
3. Track success/failure rates

### Custom Analytics

Add analytics tracking to password reset flow:

```typescript
// Track password reset initiation
analytics.track('password_reset_initiated', {
  email: userEmail,
  timestamp: new Date().toISOString(),
});

// Track password reset completion
analytics.track('password_reset_completed', {
  user_id: userId,
  timestamp: new Date().toISOString(),
});
```

## 9. Migration from Existing Auth

If migrating from another auth provider:

1. Export user data from existing provider
2. Import users to Supabase using batch upload
3. Update password reset flows to use new endpoints
4. Test thoroughly before switching production traffic

## 10. Additional Security Measures

### Multi-Factor Authentication

Consider implementing MFA for enhanced security:

```typescript
// Enable MFA for user after password reset
await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'Mahardika Platform',
});
```

### Account Lockout

Implement temporary account lockout after multiple failed attempts:

```typescript
// Track failed attempts in database
// Lock account after 5 failed attempts within 1 hour
```

## Conclusion

This implementation provides a complete, secure password reset flow for the Mahardika Platform using
Supabase authentication. The system includes proper error handling, rate limiting, and branded email
templates that match the platform's design system.

For support or questions, refer to the
[Supabase Documentation](https://supabase.com/docs/guides/auth/auth-password-reset) or contact the
development team.
