#!/usr/bin/env node
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.local') });
/*
 * Mahardika – Local database bootstrap for development.
 * 1) Runs `prisma migrate dev` to apply the latest schema.
 * 2) Seeds baseline roles so the app can assume their existence.
 *    If the table/enum does not exist (depending on schema), the
 *    seed step fails silently.
 */
const { execSync } = require('child_process');
const path = require('path');

// Ensure we are in app root (apps/web)
const cwd = __dirname;

try {
  console.log('🛠️  Running Prisma migrations...');
  execSync('pnpm prisma migrate dev --skip-generate', { stdio: 'inherit', cwd });
} catch (err) {
  console.error('Prisma migration failed:', err.message);
  process.exit(1);
}

// Seed roles if possible
(async () => {
  console.log('🌱 Seeding core roles...');
  let PrismaClient;
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    PrismaClient = require('@prisma/client').PrismaClient;
  } catch {
    console.warn('Prisma Client not generated yet – skipping role seeding.');
    process.exit(0);
  }

  const prisma = new PrismaClient();
  const roles = ['Admin', 'Agency', 'Staff', 'Customer'];

  for (const role of roles) {
    try {
      // Attempt to insert into a roles table if it exists
      await prisma.$executeRawUnsafe(
        `INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        role
      );
    } catch (err) {
      // Ignore if table or constraint does not exist – schema may store roles elsewhere.
      console.warn(`  • Skipped inserting role "${role}": ${err.message}`);
    }
  }

  await prisma.$disconnect();
  console.log('✅ Database ready!');
})();
