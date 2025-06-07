# Mahardika Platform - Prettier & ESLint Setup

Complete code formatting and linting configuration for the Mahardika Platform monorepo with
brand-consistent styling and quality enforcement.

## 🎨 Brand Integration

All configurations follow Mahardika brand standards:

- **Navy (#0D1B2A)** - Primary brand color
- **Gold (#F4B400)** - Accent brand color
- **Consistent styling** - 0.5rem border radius, clean typography
- **Accessibility focus** - WCAG compliance and semantic HTML

## 📁 Configuration Files

### Root Configuration

- **`.prettierrc`** - Prettier formatting rules
- **`.prettierignore`** - Files excluded from formatting
- **`.eslintrc.js`** - Root ESLint configuration (comprehensive rules)

### Package-Specific Configuration

- **`packages/ui/.eslintrc.js`** - UI library specific rules
- **`apps/web/.eslintrc.json`** - Next.js specific configuration

## 🔧 Prettier Configuration

### Settings (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "endOfLine": "lf"
}
```

### File-Specific Overrides

- **Markdown**: 100 character width, always wrap prose
- **JSON**: 120 character width for configuration files
- **YAML**: 2-space indentation, double quotes

### Ignored Files

- Build outputs (`dist/`, `.next/`, `build/`)
- Dependencies (`node_modules/`)
- Generated files (`*.min.js`, `*.bundle.js`)
- Lock files (`pnpm-lock.yaml`)
- Environment files (`.env*`)

## 🔍 ESLint Configuration

### Core Rules

- **TypeScript**: Strict type checking, consistent imports
- **React**: Modern React patterns, hooks compliance
- **Accessibility**: WCAG guidelines, semantic HTML
- **Code Quality**: Unused imports, consistent naming
- **Mahardika Standards**: Brand color usage, component patterns

### Package-Specific Rules

#### UI Library (`packages/ui`)

```javascript
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

#### Next.js App (`apps/web`)

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@next/next/no-html-link-for-pages": "error",
    "@next/next/no-img-element": "warn",
    "react/no-unescaped-entities": "error"
  }
}
```

## 📜 Available Scripts

### Root Level

```bash
# Format all files
pnpm run format

# Check formatting without fixing
pnpm run format:check

# Lint all packages
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Test linting setup
pnpm run lint:test
```

### Package Level

```bash
# UI Package
cd packages/ui
pnpm run lint        # Check linting
pnpm run lint:fix    # Fix issues
pnpm run format      # Format code
pnpm run format:check # Check formatting

# Web App
cd apps/web
pnpm run lint        # Next.js linting
pnpm run lint:fix    # Fix issues
pnpm run format      # Format code
```

## 🚀 Usage Examples

### Daily Development Workflow

```bash
# Before committing
pnpm run format      # Format all files
pnpm run lint        # Check for issues
pnpm run build       # Verify builds
pnpm run test        # Run tests

# Or use the pre-commit script
pnpm run pre-commit  # Runs all checks
```

### IDE Integration

#### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.workingDirectories": ["packages/ui", "apps/web"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### WebStorm/IntelliJ

1. Enable Prettier: `Settings > Languages > JavaScript > Prettier`
2. Enable ESLint: `Settings > Languages > JavaScript > Code Quality Tools > ESLint`
3. Set format on save: `Settings > Tools > Actions on Save`

### Git Hooks Integration

```bash
# Install husky for git hooks
pnpm add -D husky

# Add pre-commit hook
npx husky add .husky/pre-commit "pnpm run format:check && pnpm run lint"
```

## 🛠️ Troubleshooting

### Common Issues

#### **Prettier Formatting Conflicts**

```bash
# Error: Files need formatting
pnpm run format:check
```

**Solution:**

```bash
pnpm run format  # Fix formatting
```

#### **ESLint Configuration Not Found**

```bash
# Error: Config "@typescript-eslint/recommended" not found
```

**Solution:**

```bash
# Install missing dependencies
pnpm install
# Or install specific package
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

#### **Next.js Linting Issues**

```bash
# Error: Failed to load config
```

**Solution:**

```bash
cd apps/web
pnpm install  # Ensure all dependencies are installed
npx next lint --fix  # Fix Next.js specific issues
```

#### **Monorepo Workspace Issues**

```bash
# Error: No projects matched the filters
```

**Solution:**

```bash
# Run commands in specific packages
cd packages/ui && pnpm run lint
cd apps/web && pnpm run lint
```

### Performance Optimization

#### **Large Codebase Formatting**

```bash
# Format specific directories
prettier --write "packages/ui/src/**/*.{ts,tsx}"
prettier --write "apps/web/src/**/*.{ts,tsx}"

# Use ignore patterns
echo "large-generated-file.js" >> .prettierignore
```

#### **ESLint Performance**

```bash
# Cache ESLint results
eslint --cache src/

# Lint specific file types
eslint "src/**/*.{ts,tsx}" --ext .ts,.tsx
```

## 📊 Quality Metrics

### Formatting Standards

- ✅ **Consistent indentation** (2 spaces)
- ✅ **Single quotes** for strings
- ✅ **Semicolons** required
- ✅ **Trailing commas** in ES5 contexts
- ✅ **80 character** line width

### Linting Standards

- ✅ **No unused variables** or imports
- ✅ **React hooks** compliance
- ✅ **Accessibility** rules enforced
- ✅ **TypeScript** best practices
- ✅ **Mahardika** brand consistency

### Test Coverage

```bash
# Run linting tests
pnpm run lint:test

# Expected results:
# ✅ Configuration Files
# ✅ Package Scripts
# ✅ Prettier Formatting
# ✅ ESLint Rules
# ✅ Mahardika Style Guide
# ✅ Build After Linting
```

## 🔗 Integration with CI/CD

### GitHub Actions

```yaml
name: Code Quality
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm run format:check
      - run: pnpm run lint
      - run: pnpm run build
      - run: pnpm run test
```

### Vercel Deployment

```json
{
  "buildCommand": "pnpm run format:check && pnpm run lint && pnpm run build",
  "framework": "nextjs"
}
```

## 📚 Best Practices

### Component Development

```typescript
// ✅ Good: Mahardika component pattern
import type { FC } from 'react';
import { colors } from './colors';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  children
}) => {
  return (
    <button
      style={{
        backgroundColor: colors.navy,
        borderRadius: '0.5rem', // Mahardika standard
        color: colors.white,
      }}
    >
      {children}
    </button>
  );
};
```

### Testing Patterns

```typescript
// ✅ Good: Accessible testing
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with Mahardika styling', () => {
  render(<Button>Click me</Button>);

  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toBeInTheDocument();
  expect(button).toHaveStyle('background-color: #0D1B2A');
});
```

### Import Organization

```typescript
// ✅ Good: Organized imports
import { useState, useEffect } from 'react';

import { Button } from '@mahardika/ui';
import { api } from '../services/api';

import type { User } from '../types/user';
```

## 🎯 Next Steps

1. **IDE Setup**: Configure your editor for automatic formatting
2. **Git Hooks**: Add pre-commit hooks for quality checks
3. **CI Integration**: Set up automated quality checks
4. **Team Training**: Share coding standards with team members
5. **Documentation**: Keep this guide updated with new rules

## 🔗 Resources

- **Prettier**: https://prettier.io/docs/en/configuration.html
- **ESLint**: https://eslint.org/docs/user-guide/configuring/
- **Next.js ESLint**: https://nextjs.org/docs/basic-features/eslint
- **React ESLint**: https://github.com/jsx-eslint/eslint-plugin-react
- **Accessibility**: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y

---

**Mahardika Platform - Navy #0D1B2A • Gold #F4B400**  
_Consistent code quality with brand excellence_ 🚀
