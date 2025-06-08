/**
 * Database Seed Script - Mahardika Platform
 * Populates database with initial data for development and testing
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 */

import { PrismaClient, PolicyStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  console.log('Brand Colors: Navy #0D1B2A, Gold #F4B400');

  // Create sample agencies
  const agencies = await Promise.all([
    prisma.agency.upsert({
      where: { slug: 'mahardika-insurance' },
      update: {},
      create: {
        slug: 'mahardika-insurance',
        name: 'Mahardika Insurance Agency',
        description:
          'Premier insurance services with personalized solutions for individuals and businesses.',
        logo_url: 'https://example.com/logos/mahardika-logo.png',
        website: 'https://mahardika-insurance.com',
        email: 'contact@mahardika-insurance.com',
        phone: '+1-555-0123',
        address: '123 Insurance Plaza, Suite 100',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10001',
        timezone: 'America/New_York',
        brand_color_primary: '#0D1B2A',
        brand_color_secondary: '#F4B400',
        plan_type: 'premium',
        billing_email: 'billing@mahardika-insurance.com',
        settings: {
          notification_preferences: {
            email: true,
            sms: true,
            push: true,
          },
          business_hours: {
            monday: '9:00-17:00',
            tuesday: '9:00-17:00',
            wednesday: '9:00-17:00',
            thursday: '9:00-17:00',
            friday: '9:00-17:00',
            saturday: '10:00-14:00',
            sunday: 'closed',
          },
        },
        metadata: {
          onboarding_completed: true,
          setup_date: new Date(),
          features_enabled: ['analytics', 'reviews', 'loyalty_program'],
        },
      },
    }),
    prisma.agency.upsert({
      where: { slug: 'golden-shield-insurance' },
      update: {},
      create: {
        slug: 'golden-shield-insurance',
        name: 'Golden Shield Insurance',
        description:
          'Comprehensive protection plans with award-winning customer service.',
        logo_url: 'https://example.com/logos/golden-shield-logo.png',
        website: 'https://golden-shield.com',
        email: 'info@golden-shield.com',
        phone: '+1-555-0456',
        address: '456 Protection Ave',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        postal_code: '90210',
        timezone: 'America/Los_Angeles',
        brand_color_primary: '#0D1B2A',
        brand_color_secondary: '#F4B400',
        plan_type: 'professional',
        billing_email: 'accounts@golden-shield.com',
        settings: {
          notification_preferences: {
            email: true,
            sms: false,
            push: true,
          },
        },
        metadata: {
          onboarding_completed: true,
          setup_date: new Date(),
        },
      },
    }),
  ]);

  console.log('✅ Created agencies');

  // Create sample users for each agency
  const passwordHash = await hash('password123', 12);

  const users = await Promise.all([
    // Mahardika Insurance users
    prisma.user.upsert({
      where: { email: 'admin@mahardika-insurance.com' },
      update: {},
      create: {
        agency_id: agencies[0].id,
        email: 'admin@mahardika-insurance.com',
        name: 'Sarah Johnson',
        avatar_url: 'https://example.com/avatars/sarah.jpg',
        role: 'owner',
        password_hash: passwordHash,
        email_verified: true,
        phone: '+1-555-0124',
        department: 'Administration',
        title: 'CEO & Founder',
        permissions: {
          can_manage_users: true,
          can_manage_customers: true,
          can_manage_policies: true,
          can_view_analytics: true,
          can_manage_settings: true,
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'agent@mahardika-insurance.com' },
      update: {},
      create: {
        agency_id: agencies[0].id,
        email: 'agent@mahardika-insurance.com',
        name: 'Michael Chen',
        avatar_url: 'https://example.com/avatars/michael.jpg',
        role: 'agent',
        password_hash: passwordHash,
        email_verified: true,
        phone: '+1-555-0125',
        department: 'Sales',
        title: 'Senior Insurance Agent',
        permissions: {
          can_manage_customers: true,
          can_manage_policies: true,
          can_view_analytics: false,
        },
      },
    }),
    // Golden Shield users
    prisma.user.upsert({
      where: { email: 'owner@golden-shield.com' },
      update: {},
      create: {
        agency_id: agencies[1].id,
        email: 'owner@golden-shield.com',
        name: 'Robert Davis',
        avatar_url: 'https://example.com/avatars/robert.jpg',
        role: 'owner',
        password_hash: passwordHash,
        email_verified: true,
        phone: '+1-555-0457',
        department: 'Executive',
        title: 'Managing Director',
        permissions: {
          can_manage_users: true,
          can_manage_customers: true,
          can_manage_policies: true,
          can_view_analytics: true,
          can_manage_settings: true,
        },
      },
    }),
  ]);

  console.log('✅ Created users');

  // Create sample customers
  const customers = await Promise.all([
    // Mahardika Insurance customers
    prisma.customer.upsert({
      where: {
        id: '550e8400-e29b-41d4-a716-446655440001', // temporary ID for upsert
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        agency_id: agencies[0].id,
        email: 'john.doe@email.com',
        name: 'John Doe',
        phone: '+1-555-1001',
        address: '789 Customer Lane',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10002',
        date_of_birth: new Date('1985-03-15'),
        gender: 'male',
        occupation: 'Software Engineer',
        loyalty_points: 2500,
        tier: 'gold',
        status: 'active',
        notes:
          'Excellent customer, prompt with payments. Interested in family coverage.',
      },
    }),
    prisma.customer.upsert({
      where: {
        id: '550e8400-e29b-41d4-a716-446655440002', // temporary ID for upsert
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        agency_id: agencies[0].id,
        email: 'jane.smith@email.com',
        name: 'Jane Smith',
        phone: '+1-555-1002',
        address: '456 Main Street',
        city: 'Brooklyn',
        state: 'NY',
        country: 'USA',
        postal_code: '11201',
        date_of_birth: new Date('1990-07-22'),
        gender: 'female',
        occupation: 'Marketing Manager',
        loyalty_points: 1800,
        tier: 'silver',
        status: 'active',
        notes: 'Young professional, interested in health and auto insurance.',
      },
    }),
    // Golden Shield customers
    prisma.customer.upsert({
      where: {
        id: '550e8400-e29b-41d4-a716-446655440003', // temporary ID for upsert
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        agency_id: agencies[1].id,
        email: 'david.wilson@email.com',
        name: 'David Wilson',
        phone: '+1-555-2001',
        address: '321 Pacific Ave',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        postal_code: '90211',
        date_of_birth: new Date('1978-11-05'),
        gender: 'male',
        occupation: 'Business Owner',
        loyalty_points: 5200,
        tier: 'platinum',
        status: 'active',
        notes:
          'High-value customer with multiple policies. Prefers premium coverage.',
      },
    }),
  ]);

  console.log('✅ Created customers');

  // Create sample policies
  const policies = await Promise.all([
    prisma.policy.create({
      data: {
        agency_id: agencies[0].id,
        customer_id: customers[0].id,
        policy_number: 'MAH-AUTO-001',
        policy_type: 'Auto Insurance',
        product_name: 'Comprehensive Auto Coverage',
        status: PolicyStatus.ACTIVE,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        premium_amount: 1200.0,
        coverage_amount: 50000.0,
        deductible_amount: 500.0,
        terms_conditions:
          'Standard auto insurance policy with comprehensive coverage including collision, theft, and liability protection.',
        benefits: {
          collision_coverage: true,
          comprehensive_coverage: true,
          liability_coverage: true,
          uninsured_motorist: true,
          roadside_assistance: true,
        },
        exclusions: {
          racing: true,
          commercial_use: true,
          intentional_damage: true,
        },
      },
    }),
    prisma.policy.create({
      data: {
        agency_id: agencies[0].id,
        customer_id: customers[1].id,
        policy_number: 'MAH-HEALTH-001',
        policy_type: 'Health Insurance',
        product_name: 'Individual Health Plan',
        status: PolicyStatus.ACTIVE,
        start_date: new Date('2024-02-01'),
        end_date: new Date('2025-01-31'),
        premium_amount: 350.0,
        coverage_amount: 100000.0,
        deductible_amount: 1000.0,
        terms_conditions:
          'Individual health insurance plan with nationwide network coverage.',
        benefits: {
          preventive_care: true,
          emergency_services: true,
          prescription_drugs: true,
          mental_health: true,
          maternity_care: true,
        },
        exclusions: {
          cosmetic_surgery: true,
          experimental_treatments: true,
        },
      },
    }),
    prisma.policy.create({
      data: {
        agency_id: agencies[1].id,
        customer_id: customers[2].id,
        policy_number: 'GS-BUSINESS-001',
        policy_type: 'Business Insurance',
        product_name: 'Commercial General Liability',
        status: PolicyStatus.ACTIVE,
        start_date: new Date('2024-03-01'),
        end_date: new Date('2025-02-28'),
        premium_amount: 2400.0,
        coverage_amount: 1000000.0,
        deductible_amount: 2500.0,
        terms_conditions:
          'Commercial general liability insurance for small to medium businesses.',
        benefits: {
          general_liability: true,
          property_damage: true,
          product_liability: true,
          professional_liability: true,
        },
        exclusions: {
          intentional_acts: true,
          pollution: true,
          cyber_attacks: true,
        },
      },
    }),
  ]);

  console.log('✅ Created policies');

  // Create sample reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        agency_id: agencies[0].id,
        customer_id: customers[0].id,
        rating: 5,
        title: 'Excellent Service and Support',
        content:
          'I have been with Mahardika Insurance for over 2 years now and they have consistently provided excellent service. The agents are knowledgeable and always available to help with any questions.',
        service_type: 'Customer Service',
        is_verified: true,
        is_featured: true,
        response:
          'Thank you for your kind words, John! We appreciate your loyalty and trust in our services.',
        response_date: new Date(),
      },
    }),
    prisma.review.create({
      data: {
        agency_id: agencies[0].id,
        customer_id: customers[1].id,
        rating: 4,
        title: 'Great Coverage Options',
        content:
          'Found the perfect health insurance plan for my needs. The process was smooth and the agent explained everything clearly.',
        service_type: 'Health Insurance',
        is_verified: true,
        is_featured: false,
      },
    }),
    prisma.review.create({
      data: {
        agency_id: agencies[1].id,
        customer_id: customers[2].id,
        rating: 5,
        title: 'Professional Business Insurance Solutions',
        content:
          'Golden Shield helped me find comprehensive business insurance that fits my budget. Their expertise in commercial insurance is outstanding.',
        service_type: 'Business Insurance',
        is_verified: true,
        is_featured: true,
        response:
          'We are delighted to serve your business insurance needs, David. Thank you for choosing Golden Shield!',
        response_date: new Date(),
      },
    }),
  ]);

  console.log('✅ Created reviews');

  // Create sample analytics data
  const analyticsData = await Promise.all([
    prisma.analytics.create({
      data: {
        agency_id: agencies[0].id,
        metric_name: 'monthly_revenue',
        metric_value: 45000.0,
        metric_type: 'sum',
        dimension: {
          month: '2024-01',
          currency: 'USD',
          department: 'all',
        },
        recorded_at: new Date('2024-01-31'),
        period_type: 'monthly',
      },
    }),
    prisma.analytics.create({
      data: {
        agency_id: agencies[0].id,
        metric_name: 'new_customers',
        metric_value: 25,
        metric_type: 'count',
        dimension: {
          month: '2024-01',
          source: 'referral',
        },
        recorded_at: new Date('2024-01-31'),
        period_type: 'monthly',
      },
    }),
    prisma.analytics.create({
      data: {
        agency_id: agencies[1].id,
        metric_name: 'average_policy_value',
        metric_value: 1800.0,
        metric_type: 'average',
        dimension: {
          month: '2024-01',
          policy_type: 'business',
        },
        recorded_at: new Date('2024-01-31'),
        period_type: 'monthly',
      },
    }),
  ]);

  console.log('✅ Created analytics data');

  // Create system configuration
  const systemConfigs = await Promise.all([
    prisma.systemConfig.upsert({
      where: { key: 'brand_colors' },
      update: {},
      create: {
        key: 'brand_colors',
        value: {
          primary: '#0D1B2A',
          secondary: '#F4B400',
          success: '#28a745',
          warning: '#ffc107',
          danger: '#dc3545',
          info: '#17a2b8',
        },
        description: 'Mahardika Platform brand colors and theme configuration',
        is_public: true,
      },
    }),
    prisma.systemConfig.upsert({
      where: { key: 'platform_settings' },
      update: {},
      create: {
        key: 'platform_settings',
        value: {
          maintenance_mode: false,
          max_agencies: 1000,
          max_users_per_agency: 50,
          max_customers_per_agency: 10000,
          features: {
            analytics: true,
            reviews: true,
            loyalty_program: true,
            multi_language: false,
          },
        },
        description: 'Platform-wide settings and feature flags',
        is_public: false,
      },
    }),
  ]);

  console.log('✅ Created system configuration');

  // Create sample notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        agency_id: agencies[0].id,
        user_id: users[0].id,
        title: 'Welcome to Mahardika Platform',
        content:
          'Your agency has been successfully set up. You can now start managing customers and policies.',
        type: 'welcome',
        is_read: false,
        is_sent: true,
        delivery_method: 'in_app',
        sent_at: new Date(),
        metadata: {
          priority: 'normal',
          category: 'onboarding',
        },
      },
    }),
    prisma.notification.create({
      data: {
        agency_id: agencies[0].id,
        user_id: users[1].id,
        title: 'New Customer Added',
        content: 'A new customer John Doe has been added to your agency.',
        type: 'customer_update',
        is_read: false,
        is_sent: true,
        delivery_method: 'email',
        sent_at: new Date(),
        metadata: {
          customer_id: customers[0].id,
          action: 'created',
        },
      },
    }),
  ]);

  console.log('✅ Created notifications');

  console.log(`
🎉 Database seeded successfully!

📊 Summary:
- ${agencies.length} agencies created
- ${users.length} users created
- ${customers.length} customers created
- ${policies.length} policies created
- ${reviews.length} reviews created
- ${analyticsData.length} analytics records created
- ${systemConfigs.length} system configs created
- ${notifications.length} notifications created

🎨 Brand Colors Applied:
- Navy Primary: #0D1B2A
- Gold Accent: #F4B400

🔐 Default Login Credentials:
- admin@mahardika-insurance.com / password123
- agent@mahardika-insurance.com / password123
- owner@golden-shield.com / password123

Happy coding! 🚀
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
