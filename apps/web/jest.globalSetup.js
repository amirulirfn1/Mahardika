import { colors } from '@mahardika/ui';
/**
 * Jest Global Setup - Mahardika Platform
 * Global test environment initialization
 * Brand Colors: Navy colors.navy, Gold colors.gold
 */

module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_BRAND_NAVY = 'colors.navy';
  process.env.NEXT_PUBLIC_BRAND_GOLD = 'colors.gold';
  process.env.NEXT_PUBLIC_APP_NAME = 'Mahardika Platform';

  // Mock database URL for tests
  process.env.DATABASE_URL =
    'postgresql://test:test@localhost:5432/mahardika_test';

  console.log('🧪 Jest Global Setup - Mahardika Platform initialized');
  console.log('🎨 Brand Colors: Navy colors.navy, Gold colors.gold');
};
