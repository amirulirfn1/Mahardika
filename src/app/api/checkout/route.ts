import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get user and agency context
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's agency
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('agency_id')
      .eq('id', user.id)
      .single();

    if (userError || !userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const checkoutData: CheckoutData = await request.json();

    // Validate required fields
    if (
      !checkoutData.customer_id ||
      !checkoutData.items ||
      checkoutData.items.length === 0
    ) {
      return NextResponse.json(
        {
          error: 'Missing required fields: customer_id and items',
        },
        { status: 400 }
      );
    }

    // Calculate totals
    const amount = checkoutData.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    const tax_amount = amount * 0.08; // 8% tax rate
    const total_amount = amount + tax_amount;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        agency_id: userRecord.agency_id,
        customer_id: checkoutData.customer_id,
        amount,
        tax_amount,
        total_amount,
        payment_method: checkoutData.payment_method || 'pending',
        payment_status: 'pending',
        notes: checkoutData.notes,
        order_data: {
          customer_name: checkoutData.customer_name,
          customer_email: checkoutData.customer_email,
          customer_phone: checkoutData.customer_phone,
          checkout_timestamp: new Date().toISOString(),
          user_id: user.id,
        },
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        {
          error: 'Failed to create order',
          details: orderError.message,
        },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = checkoutData.items.map(item => ({
      order_id: order.id,
      product_name: item.product_name,
      product_description: item.product_description,
      product_sku: item.product_sku,
      unit_price: item.unit_price,
      quantity: item.quantity,
      total_price: item.unit_price * item.quantity,
      product_data: {
        product_id: item.product_id,
      },
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      // Cleanup the order if items failed
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        {
          error: 'Failed to create order items',
          details: itemsError.message,
        },
        { status: 500 }
      );
    }

    // Return success response with order details
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        state: order.state,
        amount: order.amount,
        tax_amount: order.tax_amount,
        total_amount: order.total_amount,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve order status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get user and agency context
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get order with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items(*),
        customers(name, email, phone)
      `
      )
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
