/**
 * Apply Sample Data to Supabase Database
 * This script applies sample agencies, customers, and other data for demonstration
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/web/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySampleData() {
  console.log('🗄️ Applying sample data to Supabase database...');

  try {
    // Sample customers
    console.log('👥 Adding sample customers...');
    const customers = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0101',
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
        phone: '+1-555-0102',
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
        phone: '+1-555-0103',
        address_line1: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60601',
        country: 'USA',
        status: 'active',
      },
    ];

    for (const customer of customers) {
      const { error } = await supabase.from('customers').upsert(customer, {
        onConflict: 'email',
        ignoreDuplicates: true,
      });

      if (error && error.code !== '23505') {
        console.warn(`⚠️ Customer ${customer.email}:`, error.message);
      }
    }

    // Sample agencies
    console.log('🏢 Adding sample agencies...');
    const agencies = [
      {
        slug: 'premium-insurance-solutions',
        name: 'Premium Insurance Solutions',
        tagline: 'Your trusted partner for comprehensive insurance coverage',
        description:
          'We provide comprehensive insurance solutions for individuals and businesses. With over 20 years of experience, we offer personalized service and competitive rates across all major insurance categories including auto, home, life, and commercial insurance.',
        banner_image_url:
          'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=400&fit=crop',
        logo_url:
          'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop',
        website_url: 'https://premiuminsurance.example.com',
        contact_email: 'info@premiuminsurance.example.com',
        contact_phone: '+1-555-123-4567',
        rating: 4.8,
        review_count: 127,
        status: 'active',
      },
      {
        slug: 'secure-family-insurance',
        name: 'Secure Family Insurance',
        tagline: 'Protecting what matters most to you',
        description:
          'A family-owned insurance agency serving the community for over 30 years. We specialize in personal insurance including auto, homeowners, renters, and life insurance. Our experienced agents work with multiple carriers to find you the best coverage at competitive rates.',
        banner_image_url:
          'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&h=400&fit=crop',
        logo_url:
          'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200&h=200&fit=crop',
        website_url: 'https://securefamily.example.com',
        contact_email: 'contact@securefamily.example.com',
        contact_phone: '+1-555-234-5678',
        rating: 4.6,
        review_count: 89,
        status: 'active',
      },
      {
        slug: 'business-shield-insurance',
        name: 'Business Shield Insurance',
        tagline: 'Commercial insurance solutions for modern businesses',
        description:
          'Specializing in commercial insurance for small to medium-sized businesses. We offer comprehensive coverage including general liability, professional liability, property, workers compensation, and cyber liability insurance. Our team understands the unique risks businesses face today.',
        banner_image_url:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop',
        logo_url:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
        website_url: 'https://businessshield.example.com',
        contact_email: 'hello@businessshield.example.com',
        contact_phone: '+1-555-345-6789',
        rating: 4.9,
        review_count: 156,
        status: 'active',
      },
      {
        slug: 'coastal-insurance-group',
        name: 'Coastal Insurance Group',
        tagline: 'Comprehensive coverage for coastal living',
        description:
          'Located in the heart of the coastal region, we understand the unique insurance needs of waterfront properties and coastal businesses. We offer specialized coverage for flood, hurricane, and marine risks, along with traditional insurance products.',
        banner_image_url:
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=400&fit=crop',
        logo_url:
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop',
        website_url: 'https://coastalinsurance.example.com',
        contact_email: 'info@coastalinsurance.example.com',
        contact_phone: '+1-555-456-7890',
        rating: 4.7,
        review_count: 203,
        status: 'active',
      },
    ];

    const agencyIds = {};
    for (const agency of agencies) {
      const { data, error } = await supabase
        .from('agencies')
        .upsert(agency, {
          onConflict: 'slug',
          ignoreDuplicates: false,
        })
        .select('id, slug');

      if (error && error.code !== '23505') {
        console.warn(`⚠️ Agency ${agency.slug}:`, error.message);
      } else if (data && data[0]) {
        agencyIds[agency.slug] = data[0].id;
      }
    }

    // Get agency IDs for existing agencies if not from upsert
    if (Object.keys(agencyIds).length === 0) {
      const { data } = await supabase
        .from('agencies')
        .select('id, slug')
        .in(
          'slug',
          agencies.map(a => a.slug)
        );

      if (data) {
        data.forEach(agency => {
          agencyIds[agency.slug] = agency.id;
        });
      }
    }

    console.log('✅ Sample data application completed!');
    console.log(`📊 Created/updated ${agencies.length} agencies`);
    console.log(`👥 Created/updated ${customers.length} customers`);
    console.log('\n🌐 Your index page should now show real database data!');
  } catch (error) {
    console.error('❌ Error applying sample data:', error);
    process.exit(1);
  }
}

// Run the script
applySampleData().catch(console.error);
