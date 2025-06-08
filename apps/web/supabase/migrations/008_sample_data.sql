-- =============================================================================
-- Mahardika Platform - Sample Data for Testing
-- Brand Colors: Navy #0D1B2A, Gold #F4B400
-- =============================================================================

-- Insert sample agencies
INSERT INTO agencies (
  slug, name, tagline, description, contact_email, contact_phone, website_url,
  address_line1, city, state, zip_code, country,
  banner_image_url, logo_url, license_number, business_type, years_in_business,
  rating, review_count, insurance_types, status, verified
) VALUES 
(
  'premium-insurance-solutions',
  'Premium Insurance Solutions',
  'Your trusted partner for comprehensive insurance coverage',
  'We provide comprehensive insurance solutions for individuals and businesses. With over 20 years of experience, we offer personalized service and competitive rates across all major insurance categories.',
  'info@premiuminsurance.example.com',
  '+1-555-123-4567',
  'https://premiuminsurance.example.com',
  '123 Insurance Ave',
  'New York',
  'NY',
  '10001',
  'USA',
  'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop',
  'INS-NY-001234',
  'Independent Agency',
  22,
  4.8,
  127,
  ARRAY['auto', 'home', 'life', 'business']::insurance_type[],
  'active',
  true
),
(
  'secure-family-insurance',
  'Secure Family Insurance',
  'Protecting what matters most to you',
  'A family-owned insurance agency serving the community for over 30 years. We specialize in personal insurance including auto, homeowners, renters, and life insurance.',
  'contact@securefamily.example.com',
  '+1-555-234-5678',
  'https://securefamily.example.com',
  '456 Family St',
  'Los Angeles',
  'CA',
  '90210',
  'USA',
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200&h=200&fit=crop',
  'INS-CA-005678',
  'Family Agency',
  32,
  4.6,
  89,
  ARRAY['auto', 'home', 'life']::insurance_type[],
  'active',
  true
),
(
  'business-shield-insurance',
  'Business Shield Insurance',
  'Commercial insurance solutions for modern businesses',
  'Specializing in commercial insurance for small to medium-sized businesses. We offer comprehensive coverage including general liability, professional liability, and cyber insurance.',
  'hello@businessshield.example.com',
  '+1-555-345-6789',
  'https://businessshield.example.com',
  '789 Business Blvd',
  'Chicago',
  'IL',
  '60601',
  'USA',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
  'INS-IL-009012',
  'Commercial Specialist',
  15,
  4.9,
  156,
  ARRAY['business', 'cyber']::insurance_type[],
  'active',
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = NOW();

-- Insert sample customers
INSERT INTO customers (
  name, email, phone, date_of_birth, gender, marital_status, occupation,
  address_line1, city, state, zip_code, country, status
) VALUES 
(
  'John Smith',
  'john.smith@example.com',
  '+1-555-0201',
  '1985-03-15',
  'male',
  'married',
  'Software Engineer',
  '123 Main St',
  'New York',
  'NY',
  '10001',
  'USA',
  'active'
),
(
  'Sarah Johnson',
  'sarah.j@example.com',
  '+1-555-0202',
  '1990-07-22',
  'female',
  'single',
  'Marketing Manager',
  '456 Oak Ave',
  'Los Angeles',
  'CA',
  '90210',
  'USA',
  'active'
),
(
  'Michael Chen',
  'm.chen@example.com',
  '+1-555-0203',
  '1988-11-08',
  'male',
  'married',
  'Business Owner',
  '789 Pine St',
  'Chicago',
  'IL',
  '60601',
  'USA',
  'active'
),
(
  'Emily Rodriguez',
  'emily.r@example.com',
  '+1-555-0204',
  '1992-05-12',
  'female',
  'single',
  'Teacher',
  '321 Elm Dr',
  'Miami',
  'FL',
  '33101',
  'USA',
  'active'
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Insert sample products
INSERT INTO products (
  agency_id, name, description, slug, sku, insurance_type,
  base_price, currency, category, is_active, is_featured
) VALUES 
(
  (SELECT id FROM agencies WHERE slug = 'premium-insurance-solutions' LIMIT 1),
  'Auto Insurance Quote',
  'Get a personalized auto insurance quote with comprehensive coverage options',
  'auto-insurance-quote',
  'AUTO-001',
  'auto',
  299.99,
  'USD',
  'Auto Insurance',
  true,
  true
),
(
  (SELECT id FROM agencies WHERE slug = 'secure-family-insurance' LIMIT 1),
  'Home Insurance Package',
  'Complete home insurance protection for your most valuable asset',
  'home-insurance-package',
  'HOME-001',
  'home',
  899.99,
  'USD',
  'Home Insurance',
  true,
  true
),
(
  (SELECT id FROM agencies WHERE slug = 'business-shield-insurance' LIMIT 1),
  'Business Liability Coverage',
  'Essential liability protection for your business operations',
  'business-liability-coverage',
  'BIZ-001',
  'business',
  1499.99,
  'USD',
  'Commercial Insurance',
  true,
  true
),
(
  (SELECT id FROM agencies WHERE slug = 'premium-insurance-solutions' LIMIT 1),
  'Life Insurance Policy',
  'Term and whole life insurance options to protect your family''s future',
  'life-insurance-policy',
  'LIFE-001',
  'life',
  450.00,
  'USD',
  'Life Insurance',
  true,
  true
),
(
  (SELECT id FROM agencies WHERE slug = 'secure-family-insurance' LIMIT 1),
  'Renters Insurance',
  'Affordable protection for your personal belongings and liability coverage',
  'renters-insurance',
  'RENT-001',
  'home',
  180.00,
  'USD',
  'Renters Insurance',
  true,
  false
) ON CONFLICT (agency_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  updated_at = NOW();

-- Insert sample reviews
INSERT INTO reviews (
  agency_id, reviewer_name, reviewer_email, rating, title, comment, status
) VALUES 
(
  (SELECT id FROM agencies WHERE slug = 'premium-insurance-solutions' LIMIT 1),
  'Sarah Johnson',
  'sarah.j@example.com',
  5,
  'Excellent service and competitive rates',
  'The team was professional and helped me find the perfect coverage for my family. Highly recommend!',
  'approved'
),
(
  (SELECT id FROM agencies WHERE slug = 'premium-insurance-solutions' LIMIT 1),
  'Michael Chen',
  'm.chen@example.com',
  5,
  'Outstanding customer service',
  'They made the insurance process simple and stress-free. Been with them for 3 years now.',
  'approved'
),
(
  (SELECT id FROM agencies WHERE slug = 'secure-family-insurance' LIMIT 1),
  'Emily Rodriguez',
  'emily.r@example.com',
  4,
  'Great local agency',
  'Quick response times and knowledgeable agents who really understand the local market.',
  'approved'
),
(
  (SELECT id FROM agencies WHERE slug = 'business-shield-insurance' LIMIT 1),
  'David Wilson',
  'david.w@example.com',
  5,
  'Perfect for small businesses',
  'They understood my business needs and provided comprehensive coverage at a great price.',
  'approved'
),
(
  (SELECT id FROM agencies WHERE slug = 'premium-insurance-solutions' LIMIT 1),
  'Lisa Thompson',
  'lisa.t@example.com',
  4,
  'Professional and reliable',
  'Great experience from quote to policy activation. Very knowledgeable staff.',
  'approved'
) ON CONFLICT (agency_id, reviewer_email) DO UPDATE SET
  rating = EXCLUDED.rating,
  title = EXCLUDED.title,
  comment = EXCLUDED.comment,
  updated_at = NOW();

-- Insert sample orders
INSERT INTO orders (
  customer_id, agency_id, order_number, state, subtotal, tax_amount, total_amount,
  currency, payment_method, payment_status
) VALUES 
(
  (SELECT id FROM customers WHERE email = 'john.smith@example.com' LIMIT 1),
  (SELECT id FROM agencies WHERE slug = 'premium-insurance-solutions' LIMIT 1),
  'ORD-2024-0001',
  'CLEARED',
  299.99,
  24.00,
  323.99,
  'USD',
  'credit_card',
  'completed'
),
(
  (SELECT id FROM customers WHERE email = 'sarah.j@example.com' LIMIT 1),
  (SELECT id FROM agencies WHERE slug = 'secure-family-insurance' LIMIT 1),
  'ORD-2024-0002',
  'PROCESSING',
  899.99,
  72.00,
  971.99,
  'USD',
  'bank_transfer',
  'pending'
),
(
  (SELECT id FROM customers WHERE email = 'm.chen@example.com' LIMIT 1),
  (SELECT id FROM agencies WHERE slug = 'business-shield-insurance' LIMIT 1),
  'ORD-2024-0003',
  'CLEARED',
  1499.99,
  120.00,
  1619.99,
  'USD',
  'credit_card',
  'completed'
) ON CONFLICT (order_number) DO UPDATE SET
  state = EXCLUDED.state,
  payment_status = EXCLUDED.payment_status,
  updated_at = NOW();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Sample data inserted successfully!';
  RAISE NOTICE '🏢 Agencies: %, Premium Insurance Solutions, Secure Family Insurance, Business Shield Insurance';
  RAISE NOTICE '👥 Customers: 4 sample customers created';
  RAISE NOTICE '🛍️ Products: 5 insurance products created';  
  RAISE NOTICE '⭐ Reviews: 5 customer reviews created';
  RAISE NOTICE '📦 Orders: 3 sample orders created';
  RAISE NOTICE '';
  RAISE NOTICE '🌐 Your Mahardika platform is now ready with sample data!';
  RAISE NOTICE 'Visit your app at http://localhost:3005 to see the data in action.';
END $$; 