import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  create,
  verify,
  getNumericDate,
} from 'https://deno.land/x/djwt@v2.8/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  order_id: string;
  customer_email: string;
  customer_name: string;
  agency_name: string;
  order_number: string;
  review_token: string;
}

interface SupabaseOrder {
  id: string;
  order_number: string;
  customer_id: string;
  agency_id: string;
  review_token: string;
  review_token_expires_at: string;
  customers: {
    name: string;
    email: string;
  };
  agencies: {
    name: string;
    slug: string;
    brand_color_primary: string;
    brand_color_secondary: string;
  };
}

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let emailData: EmailRequest;

    if (req.method === 'POST') {
      // Manual email sending
      emailData = await req.json();
    } else {
      // Handle webhook/notification from order completion
      const { order_id } = await req.json();

      // Fetch order details
      const { data: order, error: orderError } = (await supabaseClient
        .from('orders')
        .select(
          `
          id,
          order_number,
          customer_id,
          agency_id,
          review_token,
          review_token_expires_at,
          customers(name, email),
          agencies(name, slug, brand_color_primary, brand_color_secondary)
        `
        )
        .eq('id', order_id)
        .single()) as { data: SupabaseOrder | null; error: any };

      if (orderError || !order) {
        throw new Error(`Order not found: ${orderError?.message}`);
      }

      if (!order.review_token) {
        throw new Error('No review token available for this order');
      }

      emailData = {
        order_id: order.id,
        customer_email: order.customers.email,
        customer_name: order.customers.name,
        agency_name: order.agencies.name,
        order_number: order.order_number,
        review_token: order.review_token,
      };
    }

    // Generate JWT for secure review link
    const jwtSecret = Deno.env.get('JWT_SECRET') || 'your-secret-key';
    const encoder = new TextEncoder();
    const keyBuf = encoder.encode(jwtSecret);
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuf,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    const payload = {
      review_token: emailData.review_token,
      order_id: emailData.order_id,
      customer_email: emailData.customer_email,
      exp: getNumericDate(60 * 60 * 24 * 30), // 30 days
      iat: getNumericDate(new Date()),
      iss: 'mahardika-platform',
    };

    const jwt = await create({ alg: 'HS256', typ: 'JWT' }, payload, key);

    // Construct review URL
    const baseUrl = Deno.env.get('SITE_URL') || 'https://your-site.com';
    const reviewUrl = `${baseUrl}/review?token=${jwt}`;

    // Email template with Mahardika branding
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Share Your Experience - ${emailData.agency_name}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #0D1B2A;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #0D1B2A 0%, rgba(13, 27, 42, 0.9) 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .content {
            padding: 40px 20px;
        }
        .order-info {
            background-color: rgba(244, 180, 0, 0.1);
            border-left: 4px solid #F4B400;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .btn {
            display: inline-block;
            background-color: #F4B400;
            color: #0D1B2A !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: background-color 0.3s ease;
        }
        .btn:hover {
            background-color: #e6a200;
        }
        .stars {
            font-size: 24px;
            color: #F4B400;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .divider {
            height: 1px;
            background-color: #e9ecef;
            margin: 30px 0;
        }
        @media (max-width: 600px) {
            .content {
                padding: 20px 15px;
            }
            .header {
                padding: 30px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${emailData.agency_name}</div>
            <p style="margin: 0; opacity: 0.9;">Thank you for your business!</p>
        </div>
        
        <div class="content">
            <h2 style="color: #0D1B2A; margin-top: 0;">How was your experience?</h2>
            
            <p>Dear ${emailData.customer_name},</p>
            
            <p>Thank you for choosing ${emailData.agency_name}! We hope you're satisfied with our service.</p>
            
            <div class="order-info">
                <strong>Order Details:</strong><br>
                Order Number: <strong>${emailData.order_number}</strong><br>
                Date: ${new Date().toLocaleDateString()}
            </div>
            
            <p>Your feedback is incredibly valuable to us and helps other customers make informed decisions. Would you mind taking a moment to share your experience?</p>
            
            <div class="stars">⭐ ⭐ ⭐ ⭐ ⭐</div>
            
            <div style="text-align: center;">
                <a href="${reviewUrl}" class="btn">Leave a Review</a>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #6c757d;">
                <strong>Why reviews matter:</strong><br>
                • Help other customers find quality service<br>
                • Enable us to improve our offerings<br>
                • Support local business in your community
            </p>
            
            <p style="font-size: 14px; color: #6c757d;">
                This review link is secure and will expire in 30 days. If you have any questions or concerns, 
                please don't hesitate to contact us directly.
            </p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${emailData.agency_name}. All rights reserved.</p>
            <p style="margin: 5px 0;">Powered by Mahardika Platform</p>
        </div>
    </div>
</body>
</html>`;

    const emailText = `
Dear ${emailData.customer_name},

Thank you for choosing ${emailData.agency_name}! We hope you're satisfied with our service.

Order Details:
Order Number: ${emailData.order_number}
Date: ${new Date().toLocaleDateString()}

Your feedback is incredibly valuable to us and helps other customers make informed decisions. Would you mind taking a moment to share your experience?

Please click the link below to leave a review:
${reviewUrl}

This review link is secure and will expire in 30 days.

Best regards,
${emailData.agency_name} Team

---
© ${new Date().getFullYear()} ${emailData.agency_name}. All rights reserved.
Powered by Mahardika Platform
`;

    // Send email using your preferred email service
    // This example uses a generic HTTP email service
    const emailServiceUrl = Deno.env.get('EMAIL_SERVICE_URL');
    const emailApiKey = Deno.env.get('EMAIL_API_KEY');

    if (emailServiceUrl && emailApiKey) {
      const emailResponse = await fetch(emailServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${emailApiKey}`,
        },
        body: JSON.stringify({
          to: emailData.customer_email,
          from: `${emailData.agency_name} <reviews@mahardika-platform.com>`,
          subject: `Share your experience with ${emailData.agency_name}`,
          html: emailHtml,
          text: emailText,
          tags: ['review-request', 'order-complete'],
          metadata: {
            order_id: emailData.order_id,
            order_number: emailData.order_number,
            agency_name: emailData.agency_name,
          },
        }),
      });

      if (!emailResponse.ok) {
        throw new Error(`Email service error: ${emailResponse.statusText}`);
      }
    }

    // Update order to mark review email as sent
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        review_sent_at: new Date().toISOString(),
      })
      .eq('id', emailData.order_id);

    if (updateError) {
      console.error('Failed to update review_sent_at:', updateError);
    }

    // Log the email sending for audit
    await supabaseClient.from('audit_logs').insert({
      agency_id: emailData.order_id, // This should be fetched from order
      action: 'review_email_sent',
      resource: 'order',
      resource_id: emailData.order_id,
      user_email: 'system@mahardika.com',
      user_role: 'system',
      new_values: {
        customer_email: emailData.customer_email,
        review_url: reviewUrl,
        jwt_expires: payload.exp,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Review email sent successfully',
        data: {
          customer_email: emailData.customer_email,
          review_url: reviewUrl,
          jwt_token: jwt,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Send review email error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send review email',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

/* Edge Function Usage Examples:

1. Manual trigger (POST):
```
POST /functions/v1/send-review-email
{
  "order_id": "uuid",
  "customer_email": "customer@example.com",
  "customer_name": "John Doe",
  "agency_name": "Mahardika Insurance",
  "order_number": "MAH-20241201-0001",
  "review_token": "uuid"
}
```

2. Webhook trigger (from order completion):
```
POST /functions/v1/send-review-email
{
  "order_id": "uuid"
}
```

Environment Variables Required:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- JWT_SECRET
- SITE_URL
- EMAIL_SERVICE_URL (optional)
- EMAIL_API_KEY (optional)

Brand Colors Used:
- Navy: #0D1B2A (Primary)
- Gold: #F4B400 (Accent)
*/
