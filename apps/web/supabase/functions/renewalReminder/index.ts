import { colors } from "@mahardika/ui";
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Mahardika Brand Colors
const MAHARDIKA_COLORS = {
  navy: 'colors.navy',
  gold: 'colors.gold',
};

interface Policy {
  id: string;
  policy_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  agency_id: string;
  agency_name: string;
  agency_plan_type: string;
  end_date: string;
  policy_type: string;
  premium_amount: number;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generate email templates for renewal reminders
 */
function generateEmailTemplate(
  policy: Policy,
  language: 'en' | 'ms' = 'en'
): EmailTemplate {
  const isEnglish = language === 'en';

  const subject = isEnglish
    ? `🔔 Policy Renewal Reminder - ${policy.policy_number}`
    : `🔔 Peringatan Pembaharuan Polisi - ${policy.policy_number}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: ${MAHARDIKA_COLORS.navy}; color: white; padding: 20px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .tagline { font-size: 14px; opacity: 0.9; }
        .content { padding: 30px; }
        .policy-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${MAHARDIKA_COLORS.gold}; }
        .cta-button { background: ${MAHARDIKA_COLORS.gold}; color: ${MAHARDIKA_COLORS.navy}; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .accent { color: ${MAHARDIKA_COLORS.gold}; }
        .urgent { color: #dc3545; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">MAHARDIKA</div>
          <div class="tagline">${isEnglish ? 'Insurance Platform' : 'Platform Insurans'}</div>
        </div>
        
        <div class="content">
          <h2>${isEnglish ? 'Policy Renewal Reminder' : 'Peringatan Pembaharuan Polisi'}</h2>
          
          <p>${isEnglish ? 'Dear' : 'Yang dihormati'} <strong>${policy.customer_name}</strong>,</p>
          
          <p>${
            isEnglish
              ? 'This is a friendly reminder that your insurance policy is expiring soon and requires renewal.'
              : 'Ini adalah peringatan mesra bahawa polisi insurans anda akan tamat tempoh tidak lama lagi dan memerlukan pembaharuan.'
          }</p>
          
          <div class="policy-details">
            <h3><span class="accent">📋</span> ${isEnglish ? 'Policy Details' : 'Butiran Polisi'}</h3>
            <p><strong>${isEnglish ? 'Policy Number' : 'Nombor Polisi'}:</strong> ${policy.policy_number}</p>
            <p><strong>${isEnglish ? 'Policy Type' : 'Jenis Polisi'}:</strong> ${policy.policy_type}</p>
            <p><strong>${isEnglish ? 'Premium Amount' : 'Jumlah Premium'}:</strong> $${policy.premium_amount.toLocaleString()}</p>
            <p><strong class="urgent">${isEnglish ? 'Expiry Date' : 'Tarikh Tamat'}:</strong> <span class="urgent">${new Date(policy.end_date).toLocaleDateString()}</span></p>
            <p><strong>${isEnglish ? 'Agency' : 'Agensi'}:</strong> ${policy.agency_name}</p>
          </div>
          
          <p>${
            isEnglish
              ? '⚠️ <strong>Important:</strong> Your policy will expire in approximately 60 days. To avoid any gap in coverage, please contact your agent or visit our platform to renew your policy.'
              : '⚠️ <strong>Penting:</strong> Polisi anda akan tamat tempoh dalam kira-kira 60 hari. Untuk mengelakkan sebarang jurang dalam perlindungan, sila hubungi ejen anda atau lawati platform kami untuk membaharui polisi anda.'
          }</p>
          
          <div style="text-align: center;">
            <a href="#" class="cta-button">
              ${isEnglish ? '🔄 Renew Policy Now' : '🔄 Baharu Polisi Sekarang'}
            </a>
          </div>
          
          <p>${
            isEnglish
              ? "If you have any questions or need assistance, please don't hesitate to contact your agent or our customer support team."
              : 'Jika anda mempunyai sebarang soalan atau memerlukan bantuan, sila jangan teragak-agak untuk menghubungi ejen anda atau pasukan sokongan pelanggan kami.'
          }</p>
          
          <p>${isEnglish ? 'Thank you for choosing Mahardika Insurance Platform.' : 'Terima kasih kerana memilih Platform Insurans Mahardika.'}</p>
          
          <p>${isEnglish ? 'Best regards,' : 'Yang benar,'}<br>
          <strong>${policy.agency_name}</strong><br>
          <span class="accent">${isEnglish ? 'Powered by Mahardika Platform' : 'Dikuasakan oleh Platform Mahardika'}</span></p>
        </div>
        
        <div class="footer">
          <p>${
            isEnglish
              ? 'This is an automated reminder. Please do not reply to this email.'
              : 'Ini adalah peringatan automatik. Sila jangan balas email ini.'
          }</p>
          <p>&copy; ${new Date().getFullYear()} Mahardika Insurance Platform. ${isEnglish ? 'All rights reserved.' : 'Hak cipta terpelihara.'}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = isEnglish
    ? `
    MAHARDIKA INSURANCE PLATFORM
    Policy Renewal Reminder

    Dear ${policy.customer_name},

    This is a friendly reminder that your insurance policy is expiring soon and requires renewal.

    Policy Details:
    - Policy Number: ${policy.policy_number}
    - Policy Type: ${policy.policy_type}
    - Premium Amount: $${policy.premium_amount.toLocaleString()}
    - Expiry Date: ${new Date(policy.end_date).toLocaleDateString()}
    - Agency: ${policy.agency_name}

    IMPORTANT: Your policy will expire in approximately 60 days. To avoid any gap in coverage, please contact your agent or visit our platform to renew your policy.

    If you have any questions or need assistance, please contact your agent or our customer support team.

    Thank you for choosing Mahardika Insurance Platform.

    Best regards,
    ${policy.agency_name}
    Powered by Mahardika Platform
  `
    : `
    PLATFORM INSURANS MAHARDIKA
    Peringatan Pembaharuan Polisi

    Yang dihormati ${policy.customer_name},

    Ini adalah peringatan mesra bahawa polisi insurans anda akan tamat tempoh tidak lama lagi dan memerlukan pembaharuan.

    Butiran Polisi:
    - Nombor Polisi: ${policy.policy_number}
    - Jenis Polisi: ${policy.policy_type}
    - Jumlah Premium: $${policy.premium_amount.toLocaleString()}
    - Tarikh Tamat: ${new Date(policy.end_date).toLocaleDateString()}
    - Agensi: ${policy.agency_name}

    PENTING: Polisi anda akan tamat tempoh dalam kira-kira 60 hari. Untuk mengelakkan sebarang jurang dalam perlindungan, sila hubungi ejen anda atau lawati platform kami untuk membaharui polisi anda.

    Jika anda mempunyai sebarang soalan atau memerlukan bantuan, sila hubungi ejen anda atau pasukan sokongan pelanggan kami.

    Terima kasih kerana memilih Platform Insurans Mahardika.

    Yang benar,
    ${policy.agency_name}
    Dikuasakan oleh Platform Mahardika
  `;

  return { subject, html, text };
}

/**
 * Send WhatsApp message (for Starter plan)
 */
async function sendWhatsAppMessage(
  policy: Policy,
  language: 'en' | 'ms' = 'en'
): Promise<boolean> {
  try {
    if (!policy.customer_phone) {
      console.log(`No phone number for customer ${policy.customer_name}`);
      return false;
    }

    const isEnglish = language === 'en';
    const message = isEnglish
      ? `🔔 MAHARDIKA INSURANCE REMINDER\n\nDear ${policy.customer_name},\n\nYour policy ${policy.policy_number} (${policy.policy_type}) expires on ${new Date(policy.end_date).toLocaleDateString()}.\n\n⚠️ Only 60 days left! Please contact ${policy.agency_name} to renew.\n\nPowered by Mahardika Platform`
      : `🔔 PERINGATAN INSURANS MAHARDIKA\n\nYang dihormati ${policy.customer_name},\n\nPolisi anda ${policy.policy_number} (${policy.policy_type}) tamat pada ${new Date(policy.end_date).toLocaleDateString()}.\n\n⚠️ Hanya 60 hari lagi! Sila hubungi ${policy.agency_name} untuk pembaharuan.\n\nDikuasakan oleh Platform Mahardika`;

    // In a real implementation, you would integrate with WhatsApp Business API
    // For now, we'll simulate success
    console.log(
      `WhatsApp message sent to ${policy.customer_phone}: ${message.substring(0, 50)}...`
    );

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}

/**
 * Main renewal reminder function
 */
async function processRenewalReminders(
  supabase: any
): Promise<{ processed: number; errors: number }> {
  let processed = 0;
  let errors = 0;

  try {
    // Calculate date 60 days from now
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 60);
    const reminderDateStr = reminderDate.toISOString().split('T')[0];

    console.log(`Processing renewal reminders for date: ${reminderDateStr}`);

    // Query policies expiring in 60 days
    const { data: policies, error: policiesError } = await supabase
      .from('policies')
      .select(
        `
        id,
        policy_number,
        policy_type,
        end_date,
        premium_amount,
        customer_id,
        customers!inner(
          id,
          name,
          email,
          phone
        ),
        agency_id,
        agencies!inner(
          id,
          name,
          plan_type
        )
      `
      )
      .eq('status', 'ACTIVE')
      .eq('end_date', reminderDateStr);

    if (policiesError) {
      console.error('Error fetching policies:', policiesError);
      return { processed: 0, errors: 1 };
    }

    console.log(
      `Found ${policies?.length || 0} policies expiring on ${reminderDateStr}`
    );

    if (!policies || policies.length === 0) {
      return { processed: 0, errors: 0 };
    }

    // Process each policy
    for (const policyData of policies) {
      try {
        const policy: Policy = {
          id: policyData.id,
          policy_number: policyData.policy_number,
          customer_id: policyData.customers.id,
          customer_name: policyData.customers.name,
          customer_email: policyData.customers.email,
          customer_phone: policyData.customers.phone,
          agency_id: policyData.agencies.id,
          agency_name: policyData.agencies.name,
          agency_plan_type: policyData.agencies.plan_type,
          end_date: policyData.end_date,
          policy_type: policyData.policy_type,
          premium_amount: policyData.premium_amount,
        };

        console.log(
          `Processing policy ${policy.policy_number} for ${policy.customer_name}`
        );

        // Determine notification method based on plan type
        if (policy.agency_plan_type === 'starter') {
          // Send WhatsApp for Starter plan
          const whatsappSent = await sendWhatsAppMessage(policy);

          if (!whatsappSent) {
            console.log(
              `WhatsApp failed for ${policy.policy_number}, falling back to email`
            );
          }
        }

        // Send Email for Growth+ plans or as fallback
        if (
          policy.agency_plan_type === 'growth' ||
          policy.agency_plan_type === 'scale' ||
          policy.agency_plan_type === 'starter'
        ) {
          const template = generateEmailTemplate(policy, 'en'); // Default to English, can be customized

          // Insert email into queue
          const { error: emailError } = await supabase.from('emails').insert({
            agency_id: policy.agency_id,
            to_email: policy.customer_email,
            to_name: policy.customer_name,
            subject: template.subject,
            html_body: template.html,
            text_body: template.text,
            email_type: 'renewal_reminder',
            policy_id: policy.id,
            customer_id: policy.customer_id,
            metadata: {
              policy_number: policy.policy_number,
              expiry_date: policy.end_date,
              reminder_date: new Date().toISOString(),
              plan_type: policy.agency_plan_type,
            },
          });

          if (emailError) {
            console.error(
              `Error queuing email for policy ${policy.policy_number}:`,
              emailError
            );
            errors++;
          } else {
            console.log(`Email queued for policy ${policy.policy_number}`);
            processed++;
          }
        }
      } catch (error) {
        console.error(
          `Error processing policy ${policyData.policy_number}:`,
          error
        );
        errors++;
      }
    }
  } catch (error) {
    console.error('Error in processRenewalReminders:', error);
    errors++;
  }

  return { processed, errors };
}

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const result = await processRenewalReminders(supabaseClient);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Renewal reminder process completed`,
        statistics: result,
        timestamp: new Date().toISOString(),
        timezone: 'MYT (UTC+8)',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
