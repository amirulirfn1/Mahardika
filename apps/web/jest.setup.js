/**
 * Jest Setup - Mahardika Platform
 * Global test configuration and utilities
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 */

import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: false,
      isReady: true,
      defaultLocale: 'en',
      domainLocales: [],
      isPreview: false,
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_BRAND_NAVY = '#0D1B2A';
process.env.NEXT_PUBLIC_BRAND_GOLD = '#F4B400';
process.env.NEXT_PUBLIC_APP_NAME = 'Mahardika Platform';
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_anon_key';

// Mock console methods in tests to reduce noise
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
        args[0].includes('componentWillUpdate'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Global test utilities
global.testUtils = {
  // Mock Mahardika colors for consistent testing
  colors: {
    navy: '#0D1B2A',
    gold: '#F4B400',
  },

  // Helper to create mock functions with common patterns
  createMockFn: returnValue => jest.fn().mockResolvedValue(returnValue),

  // Helper to wait for async operations
  waitFor: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to create mock user events
  createMockEvent: (type, properties = {}) => ({
    type,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: { value: '' },
    ...properties,
  }),
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Clean up after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();

  // Clear localStorage and sessionStorage mocks
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();

  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
});

// -----------------------------------------------------------------------------
// Enhanced Supabase mock (shared instance) for tests that rely on Supabase
// -----------------------------------------------------------------------------
const sharedAuthMock = {
  signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: '1', email: 'test@example.com' } }, error: null }),
  signUp: jest.fn().mockResolvedValue({ data: { user: { id: '1', email: 'test@example.com' } }, error: null }),
  signOut: jest.fn().mockResolvedValue({ error: null }),
  getUser: jest.fn().mockResolvedValue({ data: { user: { id: '1', email: 'test@example.com' } }, error: null }),
  getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
  resetPasswordForEmail: jest.fn().mockResolvedValue({ data: {}, error: null }),
  updateUser: jest.fn().mockResolvedValue({ data: {}, error: null }),
};
const sharedFromMock = () => ({
  select: jest.fn(() => ({
    eq: jest.fn(() => ({
      single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
    })),
  })),
  upsert: jest.fn(() => ({
    select: jest.fn(() => ({
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
});

jest.mock('@supabase/supabase-js', () => {
  const createClient = jest.fn(() => ({
    auth: sharedAuthMock,
    from: sharedFromMock,
  }));
  return { createClient };
});

// -----------------------------------------------------------------------------
// Polyfill Request / Response for API route tests
// -----------------------------------------------------------------------------
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor() {}
  };
}
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor() {}
  };
}

// -----------------------------------------------------------------------------
// Vitest compatibility shim (tests importing vitest in Jest env)
// -----------------------------------------------------------------------------
if (typeof global.vi === 'undefined') {
  global.vi = {
    fn: jest.fn,
    mock: jest.fn,
  };
}
