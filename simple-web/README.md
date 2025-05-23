# Simple Web Interface - Mahardika

This directory contains minimalistic black and white HTML pages for the Mahardika insurance platform.

## Pages Included

- **index.html** - Main landing page with platform overview
- **signin.html** - User sign-in form with email/password and Google OAuth
- **signup.html** - User registration form with comprehensive fields

## Design Features

- ✅ **Minimalistic 2D Design** - Clean black and white aesthetic
- ✅ **Responsive Layout** - Works on desktop and mobile devices
- ✅ **Pure HTML/CSS** - No external dependencies
- ✅ **Accessible Forms** - Proper labels and form validation
- ✅ **Modern Styling** - CSS Grid, Flexbox, and smooth transitions

## How to View

### Method 1: Local HTTP Server

```bash
cd simple-web
python -m http.server 8000
```

Then visit: `http://localhost:8000`

### Method 2: Live Server Extension

If using VS Code, install the "Live Server" extension and right-click on `index.html` → "Open with Live Server"

### Method 3: Direct File Access

Simply double-click any HTML file to open in your default browser.

## Navigation

- **Home** → `index.html` - Platform overview and features
- **Sign In** → `signin.html` - Login form with email/password and Google OAuth
- **Sign Up** → `signup.html` - Registration form with role selection

## Features

### Landing Page (index.html)

- Hero section with call-to-action buttons
- Feature grid showcasing platform capabilities
- Fixed navigation header
- Responsive design

### Sign In Page (signin.html)

- Email and password fields
- "Remember me" checkbox
- "Forgot password" link
- Google OAuth button
- Link to registration

### Sign Up Page (signup.html)

- Personal information fields (name, email, phone)
- Password confirmation
- Account type selection (Customer/Agent/Admin)
- Terms of service agreement
- Newsletter subscription option
- Google OAuth registration

## Styling

- **Colors**: Pure black (#000000) and white (#ffffff)
- **Typography**: Arial font family for maximum compatibility
- **Layout**: CSS Grid and Flexbox for responsive design
- **Interactions**: Hover effects and smooth transitions
- **Forms**: Consistent styling with focus states

## Integration Notes

These static pages are designed as prototypes and can be:

1. Used as templates for the Next.js application
2. Deployed as a separate simple website
3. Integrated into the main Mahardika platform

## Browser Compatibility

- ✅ Chrome/Edge (modern versions)
- ✅ Firefox (modern versions)
- ✅ Safari (modern versions)
- ✅ Mobile browsers (iOS/Android)

---

**Built with ❤️ for the Mahardika Insurance Platform**
