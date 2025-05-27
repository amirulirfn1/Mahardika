# Responsive QA Testing Checklist

## Test Environment Setup

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test the following viewport sizes:
   - **Mobile**: 375px width (iPhone SE)
   - **Tablet**: 768px width (iPad)
   - **Desktop**: 1280px width (Standard laptop)

## Pages to Test

### Login Page (`/login`)

- [ ] **375px**: Form fields stack vertically, no horizontal scroll
- [ ] **768px**: Card is centered, appropriate padding
- [ ] **1280px**: Card remains centered, background gradient visible

**Expected Issues**: Check for:

- Text overflow in buttons
- Form input sizing
- Card width constraints
- Google sign-in button responsiveness

### Dashboard Pages

Test each dashboard page at all breakpoints:

#### Main Dashboard (`/dashboard`)

- [ ] **375px**: Navigation collapses, content stacks
- [ ] **768px**: Navigation horizontal, content flows
- [ ] **1280px**: Full layout with sidebar/header

#### Users Page (`/admin/users`)

- [ ] **375px**: Card full-width, proper padding
- [ ] **768px**: Card centered, readable text
- [ ] **1280px**: Proper layout spacing

#### Payments Page (`/payments`)

- [ ] **375px**: Card layout responsive
- [ ] **768px**: Content properly spaced
- [ ] **1280px**: Full desktop layout

#### Policies Page (`/policies`)

- [ ] **375px**: No horizontal overflow
- [ ] **768px**: Card layout intact
- [ ] **1280px**: Proper spacing

#### Vehicles Page (`/vehicles`)

- [ ] **375px**: Mobile-first layout
- [ ] **768px**: Tablet optimization
- [ ] **1280px**: Desktop layout

## Navigation Testing

- [ ] **375px**: Navigation links accessible (hamburger menu if implemented)
- [ ] **768px**: Horizontal navigation readable
- [ ] **1280px**: Full navigation with proper spacing

## Common Issues to Look For

1. **Text overflow** in buttons or cards
2. **Horizontal scrolling** on mobile
3. **Touch targets** too small on mobile (< 44px)
4. **Insufficient contrast** on smaller screens
5. **Form elements** too small or hard to tap
6. **Images** not responsive
7. **Navigation** not accessible on mobile

## Testing Process

1. Navigate to each page
2. Test at each breakpoint
3. Document any layout issues
4. Create GitHub issues for fixes needed
5. Take screenshots of broken layouts

## GitHub Issue Template

```
**Title**: Responsive issue: [Page] at [Breakpoint]
**Description**:
- Page: /path/to/page
- Breakpoint: XXXpx
- Issue: Description of layout problem
- Screenshot: [Attach screenshot]
- Priority: High/Medium/Low
**Expected**: What should happen
**Actual**: What currently happens
```

## Completion Criteria

✅ All pages tested at all three breakpoints
✅ Issues logged in GitHub
✅ No horizontal scrolling on any page
✅ All interactive elements properly sized for touch
