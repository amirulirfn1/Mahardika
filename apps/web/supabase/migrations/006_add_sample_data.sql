-- =============================================================================
-- Mahardika Platform - Sample Data for Demonstration
-- Brand Colors: Navy #0D1B2A, Gold #F4B400
-- =============================================================================

-- Insert sample customers first
INSERT INTO customers (id, name, email, phone, address_line1, city, state, zip_code, country, status)
VALUES 
  (gen_random_uuid(), 'John Smith', 'john.smith@example.com', '+1-555-0101', '123 Main St', 'New York', 'NY', '10001', 'USA', 'active'),
  (gen_random_uuid(), 'Sarah Johnson', 'sarah.j@example.com', '+1-555-0102', '456 Oak Ave', 'Los Angeles', 'CA', '90210', 'USA', 'active'),
  (gen_random_uuid(), 'Michael Chen', 'm.chen@example.com', '+1-555-0103', '789 Pine St', 'Chicago', 'IL', '60601', 'USA', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample agencies
INSERT INTO agencies (id, slug, name, tagline, description, banner_image_url, logo_url, website_url, contact_email, contact_phone, rating, review_count, status)
VALUES 
  (
    gen_random_uuid(),
    'premium-insurance-solutions',
    'Premium Insurance Solutions',
    'Your trusted partner for comprehensive insurance coverage',
    'We provide comprehensive insurance solutions for individuals and businesses. With over 20 years of experience, we offer personalized service and competitive rates across all major insurance categories including auto, home, life, and commercial insurance.',
    'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop',
    'https://premiuminsurance.example.com',
    'info@premiuminsurance.example.com',
    '+1-555-123-4567',
    4.8,
    127,
    'active'
  ),
  (
    gen_random_uuid(),
    'secure-family-insurance',
    'Secure Family Insurance',
    'Protecting what matters most to you',
    'A family-owned insurance agency serving the community for over 30 years. We specialize in personal insurance including auto, homeowners, renters, and life insurance. Our experienced agents work with multiple carriers to find you the best coverage at competitive rates.',
    'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200&h=200&fit=crop',
    'https://securefamily.example.com',
    'contact@securefamily.example.com',
    '+1-555-234-5678',
    4.6,
    89,
    'active'
  ),
  (
    gen_random_uuid(),
    'business-shield-insurance',
    'Business Shield Insurance',
    'Commercial insurance solutions for modern businesses',
    'Specializing in commercial insurance for small to medium-sized businesses. We offer comprehensive coverage including general liability, professional liability, property, workers compensation, and cyber liability insurance. Our team understands the unique risks businesses face today.',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
    'https://businessshield.example.com',
    'hello@businessshield.example.com',
    '+1-555-345-6789',
    4.9,
    156,
    'active'
  ),
  (
    gen_random_uuid(),
    'coastal-insurance-group',
    'Coastal Insurance Group',
    'Comprehensive coverage for coastal living',
    'Located in the heart of the coastal region, we understand the unique insurance needs of waterfront properties and coastal businesses. We offer specialized coverage for flood, hurricane, and marine risks, along with traditional insurance products.',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop',
    'https://coastalinsurance.example.com',
    'info@coastalinsurance.example.com',
    '+1-555-456-7890',
    4.7,
    203,
    'active'
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (agency_id, name, description, slug, price, currency, category, is_active, is_featured)
SELECT 
  a.id,
  'Auto Insurance Quote',
  'Get a personalized auto insurance quote with comprehensive coverage options',
  'auto-insurance-quote',
  299.99,
  'USD',
  'Auto Insurance',
  true,
  true
FROM agencies a WHERE a.slug = 'premium-insurance-solutions'
ON CONFLICT (agency_id, slug) DO NOTHING;

INSERT INTO products (agency_id, name, description, slug, price, currency, category, is_active, is_featured)
SELECT 
  a.id,
  'Home Insurance Package',
  'Complete home insurance protection for your most valuable asset',
  'home-insurance-package',
  899.99,
  'USD',
  'Home Insurance',
  true,
  true
FROM agencies a WHERE a.slug = 'secure-family-insurance'
ON CONFLICT (agency_id, slug) DO NOTHING;

INSERT INTO products (agency_id, name, description, slug, price, currency, category, is_active, is_featured)
SELECT 
  a.id,
  'Business Liability Coverage',
  'Essential liability protection for your business operations',
  'business-liability-coverage',
  1499.99,
  'USD',
  'Commercial Insurance',
  true,
  true
FROM agencies a WHERE a.slug = 'business-shield-insurance'
ON CONFLICT (agency_id, slug) DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (agency_id, reviewer_name, reviewer_email, rating, comment, status)
SELECT 
  a.id,
  'Sarah Johnson',
  'sarah.j@example.com',
  5,
  'Excellent service and very competitive rates. The team was professional and helped me find the perfect coverage for my family. Highly recommend!',
  'approved'
FROM agencies a WHERE a.slug = 'premium-insurance-solutions'
ON CONFLICT (agency_id, reviewer_email) DO NOTHING;

INSERT INTO reviews (agency_id, reviewer_name, reviewer_email, rating, comment, status)
SELECT 
  a.id,
  'Michael Chen',
  'm.chen@example.com',
  5,
  'Outstanding customer service. They made the insurance process simple and stress-free. Been with them for 3 years now and couldn''t be happier.',
  'approved'
FROM agencies a WHERE a.slug = 'premium-insurance-solutions'
ON CONFLICT (agency_id, reviewer_email) DO NOTHING;

INSERT INTO reviews (agency_id, reviewer_name, reviewer_email, rating, comment, status)
SELECT 
  a.id,
  'Emily Rodriguez',
  'emily.r@example.com',
  4,
  'Great experience overall. Quick response times and knowledgeable agents who really understand the local market.',
  'approved'
FROM agencies a WHERE a.slug = 'secure-family-insurance'
ON CONFLICT (agency_id, reviewer_email) DO NOTHING;

INSERT INTO reviews (agency_id, reviewer_name, reviewer_email, rating, comment, status)
SELECT 
  a.id,
  'David Thompson',
  'david.t@example.com',
  5,
  'Best commercial insurance experience I''ve had. They understood our business needs and provided comprehensive coverage at a fair price.',
  'approved'
FROM agencies a WHERE a.slug = 'business-shield-insurance'
ON CONFLICT (agency_id, reviewer_email) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (agency_id, customer_id, order_number, state, amount, currency, total_amount, payment_method, payment_status)
SELECT 
  a.id,
  c.id,
  'PRM-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-0001',
  'CLEARED',
  299.99,
  'USD',
  299.99,
  'credit_card',
  'completed'
FROM agencies a 
CROSS JOIN customers c 
WHERE a.slug = 'premium-insurance-solutions' 
AND c.email = 'john.smith@example.com'
LIMIT 1
ON CONFLICT (order_number) DO NOTHING;

-- Add some order items
INSERT INTO order_items (order_id, product_name, product_description, unit_price, quantity, total_price)
SELECT 
  o.id,
  'Auto Insurance Policy',
  'Comprehensive auto insurance coverage',
  299.99,
  1,
  299.99
FROM orders o 
WHERE o.order_number LIKE 'PRM-%'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Update agency statistics
UPDATE agencies 
SET review_count = (
  SELECT COUNT(*) 
  FROM reviews r 
  WHERE r.agency_id = agencies.id 
  AND r.status = 'approved'
),
rating = (
  SELECT ROUND(AVG(r.rating)::numeric, 1) 
  FROM reviews r 
  WHERE r.agency_id = agencies.id 
  AND r.status = 'approved'
)
WHERE id IN (
  SELECT DISTINCT agency_id 
  FROM reviews 
  WHERE status = 'approved'
); 