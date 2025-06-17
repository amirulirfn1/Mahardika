import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from '../../../lib/env';

export const dynamic = 'force-dynamic';

interface CheckoutItem {
  product_id: string;
  product_name: string;
  product_description?: string;
  product_sku?: string;
  unit_price: number;
  quantity: number;
}

interface CheckoutData {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  items: CheckoutItem[];
  payment_method?: string;
  notes?: string;
}

// ✅ INPUT VALIDATION: Add proper input validation interfaces
interface CreateOrderRequest {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

// ✅ VALIDATION HELPER: Input validation function
function validateOrderRequest(body: any): CreateOrderRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  if (!body.customerId || typeof body.customerId !== 'string') {
    throw new Error('Customer ID is required');
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new Error('Order items are required');
  }

  // Validate each item
  for (const item of body.items) {
    if (!item.productId || typeof item.productId !== 'string') {
      throw new Error('Product ID is required for all items');
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new Error('Valid quantity is required for all items');
    }
    if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
      throw new Error('Valid price is required for all items');
    }
  }

  return body as CreateOrderRequest;
}

export async function POST(request: NextRequest) {
  try {
    // ✅ INPUT VALIDATION: Validate request body
    const body = await request.json();
    const validatedData = validateOrderRequest(body);

    const cookieStore = cookies();
    const { url, anonKey } = getSupabaseConfig();
    
    const supabase = createServerClient(
      url,
      anonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Calculate total amount
    const totalAmount = validatedData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order in database transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_id: validatedData.customerId,
          status: 'pending',
          total_amount: totalAmount,
          currency: 'USD',
          shipping_address: validatedData.shippingAddress || null,
          metadata: {
            source: 'web',
            timestamp: new Date().toISOString(),
          },
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = validatedData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      // Cleanup: Delete the created order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      totalAmount,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    
    // ✅ SECURITY IMPROVEMENT: Don't expose internal error details
    const errorMessage = error instanceof Error ? 
      (error.message.includes('required') || error.message.includes('Invalid') ? 
        error.message : 'An internal error occurred') 
      : 'An internal error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message.includes('required') ? 400 : 500 }
    );
  }
}

// GET endpoint to retrieve order status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const { url, anonKey } = getSupabaseConfig();
    
    const supabase = createServerClient(
      url,
      anonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            slug,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}
