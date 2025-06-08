// Mahardika Platform ESLint Configuration
// Brand Colors: Navy #0D1B2A, Gold #F4B400
// Comprehensive linting rules for monorepo with React, TypeScript, and accessibility

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // Must be last to override conflicting rules
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json',
          './apps/*/tsconfig.json',
        ],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // Mahardika Platform Specific Rules
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'off', // Handled by @typescript-eslint
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',

    // TypeScript Rules (handled by Next.js)

    // React Rules
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js/modern React
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/display-name': 'warn',
    'react/no-unescaped-entities': 'error',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'off', // Not needed in modern React
    'react/jsx-uses-vars': 'error',
    'react/no-array-index-key': 'warn',
    'react/self-closing-comp': 'error',
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],

    // React Hooks Rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Plugin-specific rules are handled by Next.js config

    // Code Quality Rules
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'array-callback-return': 'error',
    'consistent-return': 'warn',
    'default-case': 'warn',
    'no-fallthrough': 'error',
    'no-implicit-coercion': 'warn',
    'no-lonely-if': 'error',
    'no-unneeded-ternary': 'error',
    'no-nested-ternary': 'warn',
    'prefer-destructuring': [
      'warn',
      {
        array: false,
        object: true,
      },
    ],
  },
  overrides: [
    // Next.js specific configuration
    {
      files: ['apps/web/**/*.{ts,tsx}'],
      extends: ['next/core-web-vitals'],
      rules: {
        // Next.js specific rules
        '@next/next/no-html-link-for-pages': 'error',
        '@next/next/no-img-element': 'warn',
        '@next/next/no-sync-scripts': 'error',
      },
    },
    // Test files configuration
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*'],
      env: {
        jest: true,
      },

      rules: {
        // Relaxed rules for test files
        'no-console': 'off',
        'react/display-name': 'off',
      },
    },
    // Configuration files
    {
      files: ['*.config.{js,ts,mjs}', '.*rc.{js,ts}', 'scripts/**/*.{js,ts}'],
      env: {
        node: true,
      },
      rules: {
        // More permissive rules for config files
        'no-console': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    'coverage/',
    '*.min.js',
    'pnpm-lock.yaml',
    'supabase/functions/_shared/',
  ],
};
