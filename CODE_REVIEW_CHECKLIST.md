# Code Review Checklist: Brand Component Usage

## 🎯 Overview

This checklist ensures consistent usage of Mahardika brand components across all new UI development.
All reviewers must verify these items before approving any UI-related pull requests.

## 🎨 Brand Colors Compliance

- [ ] **Primary Color Usage**: All primary elements use navy `#0D1B2A`
- [ ] **Accent Color Usage**: All accent elements use gold `#F4B400`
- [ ] **No hardcoded colors**: Colors are imported from `@mahardika/ui/colors`
- [ ] **Consistent theme**: Uses `@mahardika/ui/theme` for spacing and breakpoints

## 🧩 Component Usage Requirements

### ✅ Required: Use Brand Components

- [ ] **Buttons**: Use `BrandButton` instead of regular `Button` or HTML `<button>`
- [ ] **Cards**: Use `BrandCard` instead of regular `Card` or custom divs
- [ ] **Typography**: Use brand color constants for text colors
- [ ] **Consistent Styling**: All new components follow brand design system

### ❌ Forbidden: Non-Brand Components

- [ ] **No vanilla HTML buttons**: Replace `<button>` with `BrandButton`
- [ ] **No custom cards**: Replace custom card divs with `BrandCard`
- [ ] **No inline styles**: Use brand constants instead of hardcoded colors
- [ ] **No Bootstrap components**: Use brand components or extend them properly

## 📋 Specific Component Checks

### BrandButton Usage

- [ ] Component imported: `import { BrandButton } from '@mahardika/ui'`
- [ ] Appropriate variant used: `navy`, `gold`, `navy-outline`, `gold-outline`
- [ ] Proper size specified: `sm`, `md`, `lg`
- [ ] Event handlers properly typed
- [ ] Accessibility attributes included when needed

### BrandCard Usage

- [ ] Component imported: `import { BrandCard } from '@mahardika/ui'`
- [ ] Appropriate variant used: `navy`, `gold`, `navy-outline`, `gold-outline`
- [ ] Proper size specified: `sm`, `md`, `lg`
- [ ] Content properly structured within card

### Color Usage

- [ ] Colors imported: `import { colors } from '@mahardika/ui'`
- [ ] Brand colors used: `colors.navy`, `colors.gold`
- [ ] Neutral colors from palette: `colors.gray.*`, `colors.white`, etc.
- [ ] No magic color values in CSS or inline styles

## 🔍 Code Quality Checks

### TypeScript Compliance

- [ ] All components properly typed
- [ ] Props interfaces defined for new components
- [ ] Brand component props correctly passed through
- [ ] No `any` types used without justification

### Import Organization

- [ ] Brand components imported from `@mahardika/ui`
- [ ] Import order: React, brand components, other libraries, local imports
- [ ] No unused imports
- [ ] Proper default vs named imports

### Styling Standards

- [ ] Bootstrap 5 classes used appropriately
- [ ] Custom CSS uses brand color variables
- [ ] Responsive design implemented
- [ ] Proper spacing using Bootstrap utilities

## 🧪 Testing Requirements

- [ ] **Component Tests**: New components have unit tests
- [ ] **Brand Compliance**: Tests verify brand colors are used
- [ ] **Accessibility**: Basic a11y tests included
- [ ] **Visual Regression**: Screenshots updated if needed

## 📱 Responsive Design

- [ ] **Mobile First**: Components work on mobile devices
- [ ] **Bootstrap Breakpoints**: Uses standard Bootstrap responsive classes
- [ ] **Brand Consistency**: Colors and spacing consistent across breakpoints

## ♿ Accessibility Requirements

- [ ] **Color Contrast**: Navy/gold combinations meet WCAG standards
- [ ] **Focus States**: All interactive elements have proper focus indicators
- [ ] **Screen Readers**: Appropriate ARIA labels and roles
- [ ] **Keyboard Navigation**: All functionality accessible via keyboard

## 🚀 Performance Considerations

- [ ] **Bundle Size**: No unnecessary dependencies added
- [ ] **Import Optimization**: Tree-shaking friendly imports used
- [ ] **CSS Efficiency**: Minimal custom CSS, maximum use of brand components

## 📋 Review Process

### For PR Authors

1. Run through this checklist before submitting PR
2. Include screenshots showing brand compliance
3. Update component documentation if adding new patterns
4. Ensure all tests pass, including brand compliance tests

### For Reviewers

1. Verify each checklist item
2. Test components in different screen sizes
3. Check browser DevTools for hardcoded colors
4. Ensure brand consistency across the entire feature

## 🔧 Tools and Commands

### Automated Checks

```bash
# Run linting with brand compliance rules
pnpm run lint

# Run tests including brand compliance
pnpm run test

# Check for hardcoded colors (custom script)
pnpm run check:brand-colors

# Build and verify no TypeScript errors
pnpm run build
```

### Manual Review Commands

```bash
# Search for hardcoded colors
grep -r "#[0-9A-Fa-f]{6}" apps/web/src --exclude-dir=node_modules

# Find non-brand button usage
grep -r "<button" apps/web/src --exclude-dir=node_modules

# Check for direct Bootstrap button classes
grep -r "btn-primary\|btn-secondary" apps/web/src --exclude-dir=node_modules
```

## 🎨 Brand Component Examples

### ✅ Correct Usage

```tsx
import { BrandButton, BrandCard, colors } from '@mahardika/ui';

// Good: Using brand components
<BrandButton variant="navy" size="lg" onClick={handleClick}>
  Submit
</BrandButton>

<BrandCard variant="gold-outline" size="md">
  <h3 style={{ color: colors.navy }}>Card Title</h3>
  <p style={{ color: colors.gray[600] }}>Card content</p>
</BrandCard>
```

### ❌ Incorrect Usage

```tsx
// Bad: Using vanilla HTML or hardcoded colors
<button className="btn btn-primary" style={{ backgroundColor: '#0D1B2A' }}>
  Submit
</button>

<div className="card" style={{ borderColor: '#F4B400' }}>
  <h3 style={{ color: '#0D1B2A' }}>Card Title</h3>
</div>
```

## 📚 Additional Resources

- [Brand Component Documentation](packages/ui/README.md)
- [Color Palette Reference](packages/ui/src/colors.ts)
- [Theme System Guide](packages/ui/src/theme.ts)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)

## ✅ Approval Criteria

This PR can only be approved if:

- [ ] All checklist items are verified ✅
- [ ] No hardcoded brand colors found
- [ ] All UI elements use brand components
- [ ] Tests pass and cover brand compliance
- [ ] Documentation is updated (if needed)

---

**Remember: Consistent brand usage creates a professional, cohesive user experience. Every UI
element should reflect Mahardika's navy and gold identity.**
