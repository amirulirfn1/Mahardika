/**
 * Jest Global Setup - Mahardika Platform
 * Global test environment initialization
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 */

module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_BRAND_NAVY = '#0D1B2A';
  process.env.NEXT_PUBLIC_BRAND_GOLD = '#F4B400';
  process.env.NEXT_PUBLIC_APP_NAME = 'Mahardika Platform';

  // Mock database URL for tests
  process.env.DATABASE_URL =
    'postgresql://test:test@localhost:5432/mahardika_test';

  console.log('🧪 Jest Global Setup - Mahardika Platform initialized');
  console.log('🎨 Brand Colors: Navy #0D1B2A, Gold #F4B400');
};
