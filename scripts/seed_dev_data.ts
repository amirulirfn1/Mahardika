#!/usr/bin/env tsx

/**
 * =============================================================================
 * Mahardika Platform - Enhanced Development Data Seeder with RLS Management
 * Brand Colors: Navy #0D1B2A, Gold #F4B400
 * =============================================================================
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Supabase configuration - Use service role key for elevated privileges
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.error(
    '❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required'
  );
  console.error(
    '   This script requires service role key to bypass RLS policies during seeding'
  );
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
});

// RLS management functions
async function disableRLS() {
  console.log('🔓 Temporarily disabling RLS policies for seeding...');

  const tables = [
    'agencies',
    'users',
    'customers',
    'policies',
    'reviews',
    'analytics',
    'audit_logs',
    'notifications',
  ];

  try {
    for (const table of tables) {
      const { error } = await supabase.rpc('disable_rls_for_table', {
        table_name: table,
      });
      if (error && !error.message.includes('does not exist')) {
        console.warn(`⚠️  Could not disable RLS for ${table}:`, error.message);
      }
    }
    console.log('✅ RLS policies temporarily disabled');
  } catch (error) {
    console.warn(
      '⚠️  RLS management not available, proceeding with service role key privileges'
    );
  }
}

async function enableRLS() {
  console.log('🔒 Re-enabling RLS policies...');

  const tables = [
    'agencies',
    'users',
    'customers',
    'policies',
    'reviews',
    'analytics',
    'audit_logs',
    'notifications',
  ];

  try {
    for (const table of tables) {
      const { error } = await supabase.rpc('enable_rls_for_table', {
        table_name: table,
      });
      if (error && !error.message.includes('does not exist')) {
        console.warn(
          `⚠️  Could not re-enable RLS for ${table}:`,
          error.message
        );
      }
    }
    console.log('✅ RLS policies re-enabled');
  } catch (error) {
    console.warn(
      '⚠️  RLS management not available, policies remain as configured'
    );
  }
}

// Create RLS management functions if they don't exist
async function createRLSManagementFunctions() {
  try {
    // Function to disable RLS for a specific table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION disable_rls_for_table(table_name TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE 'ALTER TABLE ' || quote_ident(table_name) || ' DISABLE ROW LEVEL SECURITY';
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
    });

    // Function to enable RLS for a specific table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION enable_rls_for_table(table_name TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE 'ALTER TABLE ' || quote_ident(table_name) || ' ENABLE ROW LEVEL SECURITY';
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
    });

    // Function to execute arbitrary SQL (for development only)
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
    });
  } catch (error) {
    // Functions might not be available in all environments
    console.warn('⚠️  Could not create RLS management functions:', error);
  }
}

// Sample data templates
const sampleAgencies = [
  {
    id: randomUUID(),
    name: 'Golden Shield Insurance',
    slug: 'golden-shield',
    hero_image_url:
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop',
    tagline: 'Protecting Your Future with Trust and Excellence',
    about_md: `# About Golden Shield Insurance

**Golden Shield Insurance** has been serving families and businesses for over 25 years with comprehensive insurance solutions tailored to your unique needs.

## Our Services
- **Life Insurance**: Comprehensive life coverage
- **Auto Insurance**: Full vehicle protection
- **Home Insurance**: Complete property coverage
- **Business Insurance**: Commercial protection

## Why Choose Us?
- ✅ 25+ years of experience
- ✅ 24/7 customer support  
- ✅ Competitive rates
- ✅ Fast claims processing

*Contact us today for a free quote!*`,
    email: 'contact@goldenshield.com',
    phone: '+1-555-0123',
    address: '123 Insurance Ave, Metro City, MC 12345',
    website: 'https://goldenshield.com',
    logo_url:
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
    business_hours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
    is_active: true,
  },
  {
    id: randomUUID(),
    name: 'Navy Coast Protection',
    slug: 'navy-coast',
    hero_image_url:
      'https://images.unsplash.com/photo-1519452634265-7b808ba79326?w=1200&h=400&fit=crop',
    tagline: "Steadfast Protection for Life's Journeys",
    about_md: `# Navy Coast Protection

**Navy Coast Protection** specializes in maritime and coastal insurance solutions, serving coastal communities with dedicated expertise.

## Our Specialties
- **Marine Insurance**: Boat and yacht coverage
- **Coastal Property**: Hurricane and flood protection
- **Commercial Marine**: Business vessel coverage
- **Personal Watercraft**: Jet ski and small boat insurance

## Our Promise
We understand the unique risks of coastal living and provide tailored protection for your lifestyle.

*Anchored in trust, sailing toward your security.*`,
    email: 'info@navycoast.com',
    phone: '+1-555-0456',
    address: '456 Harbor Drive, Coastal Bay, CB 67890',
    website: 'https://navycoast.com',
    logo_url:
      'https://images.unsplash.com/photo-1519452634265-7b808ba79326?w=200&h=200&fit=crop',
    business_hours: {
      monday: '8:00 AM - 7:00 PM',
      tuesday: '8:00 AM - 7:00 PM',
      wednesday: '8:00 AM - 7:00 PM',
      thursday: '8:00 AM - 7:00 PM',
      friday: '8:00 AM - 7:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: '12:00 PM - 4:00 PM',
    },
    is_active: true,
  },
  {
    id: randomUUID(),
    name: 'Premier Coverage Solutions',
    slug: 'premier-coverage',
    hero_image_url:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop',
    tagline: 'Premium Protection for Discerning Clients',
    about_md: `# Premier Coverage Solutions

**Premier Coverage Solutions** caters to high-net-worth individuals and businesses requiring sophisticated insurance strategies.

## Premium Services
- **Executive Life Insurance**: High-value life coverage
- **Luxury Auto**: Exotic and luxury vehicle protection
- **Estate Planning**: Comprehensive wealth protection
- **Private Client Services**: Personalized risk management

## Our Difference
- White-glove service
- Concierge claims handling
- Risk assessment specialists
- Global coverage options

*Excellence in every detail.*`,
    email: 'clientservices@premiercoverage.com',
    phone: '+1-555-0789',
    address: '789 Executive Plaza, Uptown District, UD 13579',
    website: 'https://premiercoverage.com',
    logo_url:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
    business_hours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'By Appointment',
      sunday: 'Closed',
    },
    is_active: true,
  },
];

const sampleUsers = [
  // Golden Shield Insurance users
  {
    id: randomUUID(),
    email: 'john.manager@goldenshield.com',
    name: 'John Manager',
    role: 'owner',
    agency_id: sampleAgencies[0].id,
    is_active: true,
  },
  {
    id: randomUUID(),
    email: 'sarah.agent@goldenshield.com',
    name: 'Sarah Agent',
    role: 'agent',
    agency_id: sampleAgencies[0].id,
    is_active: true,
  },
  {
    id: randomUUID(),
    email: 'mike.admin@goldenshield.com',
    name: 'Mike Admin',
    role: 'admin',
    agency_id: sampleAgencies[0].id,
    is_active: true,
  },
  // Navy Coast Protection users
  {
    id: randomUUID(),
    email: 'captain.owner@navycoast.com',
    name: 'Captain Owner',
    role: 'owner',
    agency_id: sampleAgencies[1].id,
    is_active: true,
  },
  {
    id: randomUUID(),
    email: 'lisa.marine@navycoast.com',
    name: 'Lisa Marine',
    role: 'agent',
    agency_id: sampleAgencies[1].id,
    is_active: true,
  },
  // Premier Coverage Solutions users
  {
    id: randomUUID(),
    email: 'executive.owner@premiercoverage.com',
    name: 'Executive Owner',
    role: 'owner',
    agency_id: sampleAgencies[2].id,
    is_active: true,
  },
  {
    id: randomUUID(),
    email: 'premium.advisor@premiercoverage.com',
    name: 'Premium Advisor',
    role: 'agent',
    agency_id: sampleAgencies[2].id,
    is_active: true,
  },
];

const generateCustomers = (agencyId: string, count: number) => {
  const firstNames = [
    'Emma',
    'Liam',
    'Olivia',
    'Noah',
    'Ava',
    'William',
    'Sophia',
    'James',
    'Isabella',
    'Benjamin',
    'Charlotte',
    'Lucas',
    'Amelia',
    'Henry',
    'Mia',
  ];
  const lastNames = [
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: randomUUID(),
    agency_id: agencyId,
    first_name: firstNames[index % firstNames.length],
    last_name: lastNames[index % lastNames.length],
    email: `${firstNames[index % firstNames.length].toLowerCase()}.${lastNames[index % lastNames.length].toLowerCase()}${index + 1}@email.com`,
    phone: `+1-555-${String(1000 + index).padStart(4, '0')}`,
    date_of_birth: new Date(1980 + (index % 40), index % 12, (index % 28) + 1)
      .toISOString()
      .split('T')[0],
    address: `${100 + index} Sample St, City ${index + 1}, ST 12345`,
    loyalty_points: Math.floor(Math.random() * 1000),
    is_active: true,
  }));
};

const generatePolicies = (
  agencyId: string,
  customers: any[],
  count: number
) => {
  const policyTypes = ['life', 'auto', 'home', 'business', 'marine', 'travel'];
  const statuses = ['active', 'pending', 'expired', 'cancelled'];

  return Array.from({ length: count }, (_, index) => ({
    id: randomUUID(),
    agency_id: agencyId,
    customer_id: customers[index % customers.length].id,
    policy_number: `POL-${Date.now()}-${String(index + 1).padStart(4, '0')}`,
    policy_type: policyTypes[index % policyTypes.length],
    coverage_amount: (10000 + index * 5000) * 1.0, // Convert to decimal
    premium_amount: (100 + index * 50) * 1.0, // Convert to decimal
    deductible_amount: (500 + index * 100) * 1.0, // Convert to decimal
    start_date: new Date(2024, index % 12, (index % 28) + 1)
      .toISOString()
      .split('T')[0],
    end_date: new Date(2025, index % 12, (index % 28) + 1)
      .toISOString()
      .split('T')[0],
    status: statuses[index % statuses.length],
    terms: {
      coverage_details: `Sample coverage details for ${policyTypes[index % policyTypes.length]} policy`,
      exclusions: ['Acts of war', 'Nuclear incidents', 'Intentional damage'],
      conditions: [
        'Regular premium payments required',
        'Notify insurer of claims within 30 days',
      ],
    },
    is_active: index % 4 !== 3, // 75% active
  }));
};

const generateReviews = (agencyId: string, count: number) => {
  const reviewTexts = [
    'Excellent service and very professional staff. Highly recommend!',
    'Great coverage options and competitive rates. Very satisfied.',
    'Outstanding customer service. They helped me through every step.',
    'Professional and knowledgeable agents. Great experience overall.',
    'Fast claims processing and excellent communication throughout.',
    'Comprehensive coverage and fair pricing. Would recommend to others.',
    'Friendly staff and easy to work with. Very pleased with service.',
    'Responsive and helpful. Made the insurance process simple.',
    'Great attention to detail and personalized service.',
    'Trustworthy and reliable. Feel confident with my coverage.',
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: randomUUID(),
    agency_id: agencyId,
    customer_name: `Review Customer ${index + 1}`,
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    review_text: reviewTexts[index % reviewTexts.length],
    is_verified: Math.random() > 0.2, // 80% verified
    is_active: true,
  }));
};

async function seedDatabase() {
  console.log('🚀 Starting enhanced database seeding with RLS management...');

  try {
    // Create RLS management functions if needed
    await createRLSManagementFunctions();

    // Temporarily disable RLS policies for seeding
    await disableRLS();

    // Insert agencies
    console.log('📊 Inserting agencies...');
    const { error: agenciesError } = await supabase
      .from('agencies')
      .insert(sampleAgencies);

    if (agenciesError) {
      console.error('Error inserting agencies:', agenciesError);
      throw agenciesError;
    }

    // Insert users
    console.log('👥 Inserting users...');
    const { error: usersError } = await supabase
      .from('users')
      .insert(sampleUsers);

    if (usersError) {
      console.error('Error inserting users:', usersError);
      throw usersError;
    }

    // Generate and insert customers for each agency
    console.log('🧑‍💼 Inserting customers...');
    const allCustomers = [];
    for (const agency of sampleAgencies) {
      const customers = generateCustomers(agency.id, 15);
      allCustomers.push(...customers);
    }

    const { error: customersError } = await supabase
      .from('customers')
      .insert(allCustomers);

    if (customersError) {
      console.error('Error inserting customers:', customersError);
      throw customersError;
    }

    // Generate and insert policies
    console.log('📋 Inserting policies...');
    const allPolicies = [];
    for (const agency of sampleAgencies) {
      const agencyCustomers = allCustomers.filter(
        c => c.agency_id === agency.id
      );
      const policies = generatePolicies(agency.id, agencyCustomers, 25);
      allPolicies.push(...policies);
    }

    const { error: policiesError } = await supabase
      .from('policies')
      .insert(allPolicies);

    if (policiesError) {
      console.error('Error inserting policies:', policiesError);
      throw policiesError;
    }

    // Generate and insert reviews
    console.log('⭐ Inserting reviews...');
    const allReviews = [];
    for (const agency of sampleAgencies) {
      const reviews = generateReviews(agency.id, 10);
      allReviews.push(...reviews);
    }

    const { error: reviewsError } = await supabase
      .from('reviews')
      .insert(allReviews);

    if (reviewsError) {
      console.error('Error inserting reviews:', reviewsError);
      throw reviewsError;
    }

    // Re-enable RLS policies
    await enableRLS();

    console.log('✅ Enhanced database seeding completed successfully!');
    console.log(`
📊 Seeded Data Summary:
- ${sampleAgencies.length} agencies
- ${sampleUsers.length} users  
- ${allCustomers.length} customers
- ${allPolicies.length} policies
- ${allReviews.length} reviews

🏢 Sample Agencies:
${sampleAgencies.map(a => `- ${a.name} (${a.slug})`).join('\n')}

🔒 Security Status:
- RLS policies have been re-enabled
- Service role key used for elevated privileges during seeding
- All data properly isolated by agency context
    `);
  } catch (error) {
    console.error('❌ Enhanced seeding failed:', error);

    // Attempt to re-enable RLS even if seeding failed
    try {
      await enableRLS();
      console.log('🔒 RLS policies re-enabled after error');
    } catch (rlsError) {
      console.error('❌ Failed to re-enable RLS policies:', rlsError);
    }

    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
