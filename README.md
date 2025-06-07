# Mahardika

A modern startup project built with React, Next.js, and TypeScript in a monorepo architecture.

## 🎨 Brand Colors

- **Navy (Primary)**: `#0D1B2A`
- **Gold (Accent)**: `#F4B400`
- **Border Radius**: `0.5rem`

## 🏗️ Architecture

This monorepo contains:

- **Apps**: Next.js applications
  - `@mahardika/web` - Main web application
- **Packages**: Shared libraries
  - `@mahardika/ui` - UI component library with Mahardika branding

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/amirulirfn1/Mahardika.git
cd Mahardika

# Install dependencies
pnpm install
```

### Development

```bash
# Start the web app in development mode
pnpm dev

# Run tests
pnpm run test

# Build all applications
pnpm run build

# Lint all code
pnpm run lint

# Clean build artifacts
pnpm run clean
```

## 📦 Packages

### @mahardika/ui

A React component library featuring:

- **Button** - Primary, secondary, and outline variants
- **Card** - Default, branded, and outlined variants
- **Colors** - Mahardika brand color palette
- TypeScript support
- Comprehensive test coverage

#### Usage

```tsx
import { Button, Card, colors } from "@mahardika/ui";

function App() {
  return (
    <Card variant="branded" padding="lg">
      <h1 style={{ color: colors.neutral.white }}>Welcome to Mahardika</h1>
      <Button variant="secondary" size="lg">
        Get Started
      </Button>
    </Card>
  );
}
```

## 🧪 Testing

Tests are written using Vitest and React Testing Library:

```bash
# Run all tests
pnpm run test

# Run tests for specific package
pnpm -F "@mahardika/ui" test

# Run tests in watch mode
pnpm -F "@mahardika/ui" test:watch
```

## 🏗️ Building

```bash
# Build all packages and apps
pnpm run build

# Build specific package
pnpm -F "@mahardika/ui" build
pnpm -F "@mahardika/web" build
```

## 📁 Project Structure

```
Mahardika/
├── apps/
│   └── web/                 # Next.js web application
│       ├── src/
│       │   └── app/
│       │       ├── layout.tsx
│       │       └── page.tsx
│       ├── package.json
│       ├── next.config.mjs
│       └── tsconfig.json
├── packages/
│   └── ui/                  # UI component library
│       ├── src/
│       │   ├── __tests__/
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── colors.ts
│       │   └── index.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── vitest.config.ts
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🎯 Component Guidelines

When creating new components, follow these guidelines:

1. Use the `colors` object from `@mahardika/ui` for consistent branding
2. Apply `0.5rem` border radius for rounded corners
3. Include comprehensive TypeScript types
4. Write unit tests with good coverage
5. Follow the naming convention: `ComponentName.tsx`

## 🛠️ Development Workflow

1. **Create a new component**:

   ```bash
   cd packages/ui/src
   # Create ComponentName.tsx
   # Create __tests__/ComponentName.test.tsx
   # Export from index.ts
   ```

2. **Test your component**:

   ```bash
   pnpm -F "@mahardika/ui" test
   ```

3. **Build the library**:

   ```bash
   pnpm -F "@mahardika/ui" build
   ```

4. **Use in the web app**:
   ```tsx
   import { ComponentName } from "@mahardika/ui";
   ```

## 📋 Available Scripts

| Command          | Description                 |
| ---------------- | --------------------------- |
| `pnpm dev`       | Start development servers   |
| `pnpm run test`  | Run all tests               |
| `pnpm run build` | Build all packages and apps |
| `pnpm run lint`  | Lint all code               |
| `pnpm run clean` | Clean build artifacts       |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `pnpm run test`
6. Submit a pull request

## 📄 License

ISC License

## 🏢 About Mahardika

Mahardika is a startup project focused on building innovative solutions with modern web technologies.
