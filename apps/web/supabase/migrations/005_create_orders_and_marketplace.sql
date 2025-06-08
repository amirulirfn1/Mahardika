-- =============================================================================
-- Mahardika Platform - Orders and Marketplace System
-- Brand Colors: Navy #0D1B2A, Gold #F4B400
-- =============================================================================

-- Create order status enum
CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'CLEARED', 'CANCELLED', 'REFUNDED');

-- =============================================================================
-- ORDERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Order Details
  order_number VARCHAR(100) UNIQUE NOT NULL,
  state order_status DEFAULT 'PENDING',
  
  -- Financial
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Payment
  payment_method VARCHAR(50),
  payment_status VARCHAR(50),
  payment_intent_id VARCHAR(255),
  
  -- Review System
  review_token UUID UNIQUE,
  review_token_expires_at TIMESTAMPTZ,
  review_sent_at TIMESTAMPTZ,
  
  -- Metadata
  order_data JSONB,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_agency_id ON orders(agency_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_state ON orders(state);
CREATE INDEX IF NOT EXISTS idx_orders_review_token ON orders(review_token);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- =============================================================================
-- ORDER ITEMS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Product Details
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_sku VARCHAR(100),
  
  -- Pricing
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  
  -- Metadata
  product_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =============================================================================
-- PRODUCTS TABLE (MARKETPLACE)
-- =============================================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  
  -- Product Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(100) NOT NULL,
  sku VARCHAR(100),
  
  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Product Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Categories and Tags
  category VARCHAR(100),
  tags TEXT[],
  
  -- Media
  image_url VARCHAR(500),
  images TEXT[],
  
  -- Inventory
  track_inventory BOOLEAN DEFAULT false,
  inventory_qty INTEGER DEFAULT 0,
  allow_backorder BOOLEAN DEFAULT false,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  
  -- Metadata
  product_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(agency_id, slug)
);

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_agency_id ON products(agency_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);

-- =============================================================================
-- UPDATE REVIEWS TABLE
-- =============================================================================

-- Add new columns to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS response_by UUID,
ADD COLUMN IF NOT EXISTS review_token UUID,
ADD COLUMN IF NOT EXISTS review_source VARCHAR(50) DEFAULT 'direct';

-- Create indexes for new review columns
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_review_token ON reviews(review_token);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number(agency_id_param UUID)
RETURNS TEXT AS $$
DECLARE
    base_number TEXT;
    order_number TEXT;
    counter INTEGER;
    agency_prefix TEXT;
BEGIN
    -- Get agency slug for prefix (first 3 chars, uppercase)
    SELECT UPPER(LEFT(slug, 3)) INTO agency_prefix
    FROM agencies 
    WHERE id = agency_id_param;
    
    IF agency_prefix IS NULL THEN
        agency_prefix := 'ORD';
    END IF;
    
    -- Generate base number with timestamp
    base_number := agency_prefix || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-';
    
    -- Find next sequential number for today
    SELECT COALESCE(MAX(CAST(RIGHT(order_number, 4) AS INTEGER)), 0) + 1 
    INTO counter
    FROM orders 
    WHERE order_number LIKE base_number || '%'
    AND agency_id = agency_id_param;
    
    -- Format final order number
    order_number := base_number || LPAD(counter::TEXT, 4, '0');
    
    RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
    items_total DECIMAL;
    tax_amount DECIMAL;
    total DECIMAL;
BEGIN
    -- Calculate items total
    SELECT COALESCE(SUM(total_price), 0) INTO items_total
    FROM order_items 
    WHERE order_id = order_id_param;
    
    -- Get tax amount from order
    SELECT COALESCE(orders.tax_amount, 0) INTO tax_amount
    FROM orders 
    WHERE id = order_id_param;
    
    -- Calculate final total
    total := items_total + tax_amount;
    
    -- Update order totals
    UPDATE orders 
    SET amount = items_total, 
        total_amount = total,
        updated_at = NOW()
    WHERE id = order_id_param;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION auto_generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number(NEW.agency_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_order_number();

-- Trigger to update order totals when items change
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate total_price for the item
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        NEW.total_price := NEW.unit_price * NEW.quantity;
        PERFORM calculate_order_total(NEW.order_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM calculate_order_total(OLD.order_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_totals
    BEFORE INSERT OR UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_totals();

CREATE TRIGGER trigger_update_order_totals_delete
    AFTER DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_totals();

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 5. SQL TRIGGER: award_points_and_review_token 
-- =============================================================================

-- Trigger function for awarding points and generating review tokens
CREATE OR REPLACE FUNCTION award_points_and_review_token()
RETURNS TRIGGER AS $$
DECLARE
    points_to_award INTEGER;
    token_expiry TIMESTAMPTZ;
BEGIN
    -- Only process when state changes to CLEARED
    IF NEW.state = 'CLEARED' AND (OLD.state IS NULL OR OLD.state != 'CLEARED') THEN
        
        -- Calculate loyalty points (amount / 10, rounded down)
        points_to_award := FLOOR(NEW.amount / 10);
        
        -- Award loyalty points to customer
        UPDATE customers 
        SET loyalty_points = loyalty_points + points_to_award,
            updated_at = NOW()
        WHERE id = NEW.customer_id;
        
        -- Generate review token if not already exists
        IF NEW.review_token IS NULL THEN
            -- Set token expiry to 30 days from now
            token_expiry := NOW() + INTERVAL '30 days';
            
            -- Update order with review token
            NEW.review_token := gen_random_uuid();
            NEW.review_token_expires_at := token_expiry;
        END IF;
        
        -- Log the action
        INSERT INTO audit_logs (
            agency_id, action, resource, resource_id,
            user_id, user_email, user_role,
            new_values, created_at
        ) VALUES (
            NEW.agency_id,
            'order_cleared_points_awarded',
            'order',
            NEW.id,
            NULL, -- System action
            'system@mahardika.com',
            'system',
            jsonb_build_object(
                'points_awarded', points_to_award,
                'order_amount', NEW.amount,
                'review_token_generated', NEW.review_token IS NOT NULL
            ),
            NOW()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_award_points_and_review_token
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION award_points_and_review_token();

-- =============================================================================
-- 1. SUPABASE TRIGGER: notify_order_complete
-- =============================================================================

-- Function to notify when order is complete
CREATE OR REPLACE FUNCTION notify_order_complete()
RETURNS TRIGGER AS $$
DECLARE
    customer_record RECORD;
    agency_record RECORD;
    notification_payload JSONB;
BEGIN
    -- Only trigger when order state changes to CLEARED
    IF NEW.state = 'CLEARED' AND (OLD.state IS NULL OR OLD.state != 'CLEARED') THEN
        
        -- Get customer and agency info
        SELECT c.*, a.name as agency_name, a.email as agency_email
        INTO customer_record
        FROM customers c
        JOIN agencies a ON c.agency_id = a.id
        WHERE c.id = NEW.customer_id;
        
        -- Build notification payload
        notification_payload := jsonb_build_object(
            'type', 'order_complete',
            'order_id', NEW.id,
            'order_number', NEW.order_number,
            'customer_id', NEW.customer_id,
            'customer_name', customer_record.name,
            'customer_email', customer_record.email,
            'agency_id', NEW.agency_id,
            'agency_name', customer_record.agency_name,
            'amount', NEW.amount,
            'review_token', NEW.review_token,
            'created_at', NEW.created_at
        );
        
        -- Send notification via pg_notify for real-time processing
        PERFORM pg_notify('order_complete', notification_payload::text);
        
        -- Create in-app notification for agency users
        INSERT INTO notifications (
            agency_id, title, content, type, metadata
        ) VALUES (
            NEW.agency_id,
            'Order Completed: ' || NEW.order_number,
            'Order ' || NEW.order_number || ' for customer ' || customer_record.name || ' has been completed successfully.',
            'order_complete',
            notification_payload
        );
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_notify_order_complete
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_order_complete();

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "orders_select_policy" ON orders
  FOR SELECT USING (agency_id = get_user_agency_id());

CREATE POLICY "orders_insert_policy" ON orders
  FOR INSERT WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "orders_update_policy" ON orders
  FOR UPDATE USING (agency_id = get_user_agency_id());

CREATE POLICY "orders_delete_policy" ON orders
  FOR DELETE USING (agency_id = get_user_agency_id() AND is_agency_admin());

-- Order items policies
CREATE POLICY "order_items_select_policy" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.agency_id = get_user_agency_id()
    )
  );

CREATE POLICY "order_items_insert_policy" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.agency_id = get_user_agency_id()
    )
  );

CREATE POLICY "order_items_update_policy" ON order_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.agency_id = get_user_agency_id()
    )
  );

CREATE POLICY "order_items_delete_policy" ON order_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.agency_id = get_user_agency_id()
    )
  );

-- Products policies
CREATE POLICY "products_select_policy" ON products
  FOR SELECT USING (agency_id = get_user_agency_id());

CREATE POLICY "products_insert_policy" ON products
  FOR INSERT WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "products_update_policy" ON products
  FOR UPDATE USING (agency_id = get_user_agency_id());

CREATE POLICY "products_delete_policy" ON products
  FOR DELETE USING (agency_id = get_user_agency_id() AND is_agency_admin());

-- =============================================================================
-- SAMPLE DATA FOR TESTING
-- =============================================================================

-- Insert sample products (will be filtered by RLS when accessed)
INSERT INTO products (agency_id, name, description, slug, price, category, is_active, is_featured, image_url) 
SELECT 
  id as agency_id,
  'Comprehensive Health Insurance',
  'Complete health coverage for individuals and families with nationwide network coverage.',
  'comprehensive-health-insurance',
  299.99,
  'health-insurance',
  true,
  true,
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'
FROM agencies 
WHERE slug = 'mahardika-insurance'
ON CONFLICT (agency_id, slug) DO NOTHING;

INSERT INTO products (agency_id, name, description, slug, price, category, is_active, is_featured, image_url) 
SELECT 
  id as agency_id,
  'Auto Insurance Premium',
  'Full coverage auto insurance with collision and comprehensive protection.',
  'auto-insurance-premium',
  149.99,
  'auto-insurance',
  true,
  true,
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'
FROM agencies 
WHERE slug = 'mahardika-insurance'
ON CONFLICT (agency_id, slug) DO NOTHING;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE orders IS 'Order management system with review token generation - Mahardika Platform';
COMMENT ON TABLE order_items IS 'Order line items for detailed order tracking - Mahardika Platform';
COMMENT ON TABLE products IS 'Marketplace products catalog - Mahardika Platform';

COMMENT ON FUNCTION generate_order_number(UUID) IS 'Generates unique order numbers with agency prefix - Mahardika Platform';
COMMENT ON FUNCTION calculate_order_total(UUID) IS 'Calculates and updates order totals from items - Mahardika Platform';
COMMENT ON FUNCTION award_points_and_review_token() IS 'Awards loyalty points and generates review tokens on order completion - Mahardika Platform';
COMMENT ON FUNCTION notify_order_complete() IS 'Sends notifications when orders are completed - Mahardika Platform';

-- Brand color references
COMMENT ON COLUMN orders.state IS 'Order status with navy/gold themed states - Primary: #0D1B2A, Accent: #F4B400';
COMMENT ON COLUMN products.is_featured IS 'Featured products highlighted with gold accent - #F4B400'; 
