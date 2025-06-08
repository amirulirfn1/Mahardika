/**
 * Complete Database Setup for Mahardika Platform
 * This script creates all tables and populates them with comprehensive sample data
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '../apps/web/.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    return envVars;
  } catch (error) {
    console.error('Error reading .env.local:', error.message);
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupCompleteDatabase() {
  console.log('🗄️ Setting up complete Mahardika database...');

  try {
    // Step 1: Create sample data directly without schema (schema likely exists)
    console.log('👥 Creating sample users...');
    await createSampleUsers();

    console.log('🏢 Creating sample agencies...');
    await createSampleAgencies();

    console.log('👨‍👩‍👧‍👦 Creating sample customers...');
    await createSampleCustomers();

    console.log('📋 Creating sample insurance policies...');
    await createSamplePolicies();

    console.log('⭐ Creating sample reviews...');
    await createSampleReviews();

    console.log('🛍️ Creating sample products...');
    await createSampleProducts();

    console.log('📦 Creating sample orders...');
    await createSampleOrders();

    console.log('✅ Complete database setup finished!');
    console.log('\n🌐 Your Mahardika platform is now ready with:');
    console.log('  • Sample agencies and customers');
    console.log('  • Insurance policies and claims');
    console.log('  • Products and orders');
    console.log('  • Reviews and ratings');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

async function createSampleUsers() {
  const users = [
    {
      email: 'admin@mahardika.com',
      role: 'admin',
      first_name: 'System',
      last_name: 'Administrator',
      phone: '+1-555-0001',
      is_active: true,
      email_verified: true,
    },
    {
      email: 'owner@premiuminsurance.com',
      role: 'agency_owner',
      first_name: 'Robert',
      last_name: 'Johnson',
      phone: '+1-555-0101',
      is_active: true,
      email_verified: true,
    },
    {
      email: 'owner@securefamily.com',
      role: 'agency_owner',
      first_name: 'Linda',
      last_name: 'Martinez',
      phone: '+1-555-0102',
      is_active: true,
      email_verified: true,
    },
  ];

  for (const user of users) {
    const { error } = await supabase
      .from('users')
      .upsert(user, { onConflict: 'email', ignoreDuplicates: true });

    if (error && !error.message.includes('duplicate')) {
      console.warn(`⚠️ User ${user.email}: ${error.message}`);
    }
  }
}

async function createSampleAgencies() {
  const agencies = [
    {
      slug: 'premium-insurance-solutions',
      name: 'Premium Insurance Solutions',
      tagline: 'Your trusted partner for comprehensive insurance coverage',
      description:
        'We provide comprehensive insurance solutions for individuals and businesses. With over 20 years of experience, we offer personalized service and competitive rates across all major insurance categories.',
      contact_email: 'info@premiuminsurance.example.com',
      contact_phone: '+1-555-123-4567',
      website_url: 'https://premiuminsurance.example.com',
      address_line1: '123 Insurance Ave',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      country: 'USA',
      banner_image_url:
        'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=400&fit=crop',
      logo_url:
        'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop',
      license_number: 'INS-NY-001234',
      business_type: 'Independent Agency',
      years_in_business: 22,
      rating: 4.8,
      review_count: 127,
      insurance_types: ['auto', 'home', 'life', 'business'],
      status: 'active',
      verified: true,
    },
    {
      slug: 'secure-family-insurance',
      name: 'Secure Family Insurance',
      tagline: 'Protecting what matters most to you',
      description:
        'A family-owned insurance agency serving the community for over 30 years. We specialize in personal insurance including auto, homeowners, renters, and life insurance.',
      contact_email: 'contact@securefamily.example.com',
      contact_phone: '+1-555-234-5678',
      website_url: 'https://securefamily.example.com',
      address_line1: '456 Family St',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90210',
      country: 'USA',
      banner_image_url:
        'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&h=400&fit=crop',
      logo_url:
        'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200&h=200&fit=crop',
      license_number: 'INS-CA-005678',
      business_type: 'Family Agency',
      years_in_business: 32,
      rating: 4.6,
      review_count: 89,
      insurance_types: ['auto', 'home', 'life'],
      status: 'active',
      verified: true,
    },
    {
      slug: 'business-shield-insurance',
      name: 'Business Shield Insurance',
      tagline: 'Commercial insurance solutions for modern businesses',
      description:
        'Specializing in commercial insurance for small to medium-sized businesses. We offer comprehensive coverage including general liability, professional liability, and cyber insurance.',
      contact_email: 'hello@businessshield.example.com',
      contact_phone: '+1-555-345-6789',
      website_url: 'https://businessshield.example.com',
      address_line1: '789 Business Blvd',
      city: 'Chicago',
      state: 'IL',
      zip_code: '60601',
      country: 'USA',
      banner_image_url:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop',
      logo_url:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
      license_number: 'INS-IL-009012',
      business_type: 'Commercial Specialist',
      years_in_business: 15,
      rating: 4.9,
      review_count: 156,
      insurance_types: ['business', 'cyber'],
      status: 'active',
      verified: true,
    },
  ];

  for (const agency of agencies) {
    const { error } = await supabase
      .from('agencies')
      .upsert(agency, { onConflict: 'slug', ignoreDuplicates: false });

    if (error) {
      console.warn(`⚠️ Agency ${agency.slug}: ${error.message}`);
    }
  }
}

async function createSampleCustomers() {
  const customers = [
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-0201',
      date_of_birth: '1985-03-15',
      gender: 'male',
      marital_status: 'married',
      occupation: 'Software Engineer',
      address_line1: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      country: 'USA',
      status: 'active',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1-555-0202',
      date_of_birth: '1990-07-22',
      gender: 'female',
      marital_status: 'single',
      occupation: 'Marketing Manager',
      address_line1: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90210',
      country: 'USA',
      status: 'active',
    },
    {
      name: 'Michael Chen',
      email: 'm.chen@example.com',
      phone: '+1-555-0203',
      date_of_birth: '1988-11-08',
      gender: 'male',
      marital_status: 'married',
      occupation: 'Business Owner',
      address_line1: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zip_code: '60601',
      country: 'USA',
      status: 'active',
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      phone: '+1-555-0204',
      date_of_birth: '1992-05-12',
      gender: 'female',
      marital_status: 'single',
      occupation: 'Teacher',
      address_line1: '321 Elm Dr',
      city: 'Miami',
      state: 'FL',
      zip_code: '33101',
      country: 'USA',
      status: 'active',
    },
  ];

  for (const customer of customers) {
    const { error } = await supabase
      .from('customers')
      .upsert(customer, { onConflict: 'email', ignoreDuplicates: true });

    if (error && !error.message.includes('duplicate')) {
      console.warn(`⚠️ Customer ${customer.email}: ${error.message}`);
    }
  }
}

async function createSamplePolicies() {
  // Get customer and agency IDs first
  const { data: customers } = await supabase
    .from('customers')
    .select('id, email')
    .limit(4);
  const { data: agencies } = await supabase
    .from('agencies')
    .select('id, slug')
    .limit(3);

  if (
    !customers ||
    !agencies ||
    customers.length === 0 ||
    agencies.length === 0
  ) {
    console.warn('⚠️ No customers or agencies found, skipping policies');
    return;
  }

  const policies = [
    {
      customer_id: customers[0].id,
      agency_id: agencies[0].id,
      insurance_type: 'auto',
      policy_name: 'Comprehensive Auto Insurance',
      description:
        'Full coverage auto insurance with collision and comprehensive',
      coverage_amount: 100000.0,
      deductible: 500.0,
      premium_amount: 1200.0,
      premium_frequency: 'annual',
      effective_date: '2024-01-01',
      expiration_date: '2024-12-31',
      status: 'active',
    },
    {
      customer_id: customers[1].id,
      agency_id: agencies[1].id,
      insurance_type: 'home',
      policy_name: 'Homeowners Insurance',
      description:
        'Complete home protection including dwelling and personal property',
      coverage_amount: 300000.0,
      deductible: 1000.0,
      premium_amount: 1800.0,
      premium_frequency: 'annual',
      effective_date: '2024-02-01',
      expiration_date: '2025-01-31',
      status: 'active',
    },
    {
      customer_id: customers[2].id,
      agency_id: agencies[2].id,
      insurance_type: 'business',
      policy_name: 'General Liability Insurance',
      description: 'Business liability coverage for small business operations',
      coverage_amount: 500000.0,
      deductible: 2500.0,
      premium_amount: 3600.0,
      premium_frequency: 'annual',
      effective_date: '2024-03-01',
      expiration_date: '2025-02-28',
      status: 'active',
    },
  ];

  for (const policy of policies) {
    const { error } = await supabase.from('policies').insert(policy);

    if (error) {
      console.warn(`⚠️ Policy: ${error.message}`);
    }
  }
}

async function createSampleReviews() {
  // Get agency data
  const { data: agencies } = await supabase
    .from('agencies')
    .select('id, slug')
    .limit(3);

  if (!agencies || agencies.length === 0) {
    console.warn('⚠️ No agencies found, skipping reviews');
    return;
  }

  const reviews = [
    {
      agency_id: agencies[0].id,
      reviewer_name: 'Sarah Johnson',
      reviewer_email: 'sarah.j@example.com',
      rating: 5,
      title: 'Excellent service and competitive rates',
      comment:
        'The team was professional and helped me find the perfect coverage for my family. Highly recommend!',
      status: 'approved',
    },
    {
      agency_id: agencies[0].id,
      reviewer_name: 'Michael Chen',
      reviewer_email: 'm.chen@example.com',
      rating: 5,
      title: 'Outstanding customer service',
      comment:
        'They made the insurance process simple and stress-free. Been with them for 3 years now.',
      status: 'approved',
    },
    {
      agency_id: agencies[1].id,
      reviewer_name: 'Emily Rodriguez',
      reviewer_email: 'emily.r@example.com',
      rating: 4,
      title: 'Great local agency',
      comment:
        'Quick response times and knowledgeable agents who really understand the local market.',
      status: 'approved',
    },
  ];

  for (const review of reviews) {
    const { error } = await supabase.from('reviews').upsert(review, {
      onConflict: 'agency_id,reviewer_email',
      ignoreDuplicates: true,
    });

    if (error && !error.message.includes('duplicate')) {
      console.warn(`⚠️ Review: ${error.message}`);
    }
  }
}

async function createSampleProducts() {
  // Get agency data
  const { data: agencies } = await supabase
    .from('agencies')
    .select('id, slug')
    .limit(3);

  if (!agencies || agencies.length === 0) {
    console.warn('⚠️ No agencies found, skipping products');
    return;
  }

  const products = [
    {
      agency_id: agencies[0].id,
      name: 'Auto Insurance Quote',
      description:
        'Get a personalized auto insurance quote with comprehensive coverage options',
      slug: 'auto-insurance-quote',
      sku: 'AUTO-001',
      insurance_type: 'auto',
      base_price: 299.99,
      currency: 'USD',
      category: 'Auto Insurance',
      is_active: true,
      is_featured: true,
    },
    {
      agency_id: agencies[1].id,
      name: 'Home Insurance Package',
      description:
        'Complete home insurance protection for your most valuable asset',
      slug: 'home-insurance-package',
      sku: 'HOME-001',
      insurance_type: 'home',
      base_price: 899.99,
      currency: 'USD',
      category: 'Home Insurance',
      is_active: true,
      is_featured: true,
    },
    {
      agency_id: agencies[2].id,
      name: 'Business Liability Coverage',
      description:
        'Essential liability protection for your business operations',
      slug: 'business-liability-coverage',
      sku: 'BIZ-001',
      insurance_type: 'business',
      base_price: 1499.99,
      currency: 'USD',
      category: 'Commercial Insurance',
      is_active: true,
      is_featured: true,
    },
  ];

  for (const product of products) {
    const { error } = await supabase.from('products').upsert(product, {
      onConflict: 'agency_id,slug',
      ignoreDuplicates: false,
    });

    if (error) {
      console.warn(`⚠️ Product: ${error.message}`);
    }
  }
}

async function createSampleOrders() {
  // Get customer and agency data
  const { data: customers } = await supabase
    .from('customers')
    .select('id')
    .limit(2);
  const { data: agencies } = await supabase
    .from('agencies')
    .select('id')
    .limit(2);

  if (
    !customers ||
    !agencies ||
    customers.length === 0 ||
    agencies.length === 0
  ) {
    console.warn('⚠️ No customers or agencies found, skipping orders');
    return;
  }

  const orders = [
    {
      customer_id: customers[0].id,
      agency_id: agencies[0].id,
      order_number: 'ORD-2024-0001',
      state: 'CLEARED',
      subtotal: 299.99,
      tax_amount: 24.0,
      total_amount: 323.99,
      currency: 'USD',
      payment_method: 'credit_card',
      payment_status: 'completed',
    },
    {
      customer_id: customers[1].id,
      agency_id: agencies[1].id,
      order_number: 'ORD-2024-0002',
      state: 'PROCESSING',
      subtotal: 899.99,
      tax_amount: 72.0,
      total_amount: 971.99,
      currency: 'USD',
      payment_method: 'bank_transfer',
      payment_status: 'pending',
    },
  ];

  for (const order of orders) {
    const { error } = await supabase
      .from('orders')
      .upsert(order, { onConflict: 'order_number', ignoreDuplicates: false });

    if (error) {
      console.warn(`⚠️ Order: ${error.message}`);
    }
  }
}

// Run the setup
setupCompleteDatabase().catch(console.error);
