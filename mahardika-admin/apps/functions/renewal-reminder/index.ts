import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Policy {
  id: string
  policy_number: string
  type: string
  insurer: string
  start_date: string
  end_date: string
  premium_amount: number
  vehicle: {
    plate: string
    make: string
    model: string
    year: number
    owner: {
      id: string
      full_name: string
      phone: string
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const today = new Date()
    const reminderDays = [60, 30, 7, 1] // Send reminders 60, 30, 7, and 1 days before expiry

    let totalReminders = 0

    for (const days of reminderDays) {
      const targetDate = new Date(today)
      targetDate.setDate(targetDate.getDate() + days)
      const targetDateStr = targetDate.toISOString().split('T')[0]

      console.log(`Checking for policies expiring on ${targetDateStr} (${days} days from now)`)

      // Find policies expiring on the target date that haven't received reminders yet
      const { data: policies, error: policiesError } = await supabaseClient
        .from('policies')
        .select(`
          id,
          policy_number,
          type,
          insurer,
          start_date,
          end_date,
          premium_amount,
          vehicle:vehicles (
            plate,
            make,
            model,
            year,
            owner:profiles (
              id,
              full_name,
              phone
            )
          )
        `)
        .eq('end_date', targetDateStr)

      if (policiesError) {
        console.error('Error fetching policies:', policiesError)
        continue
      }

      if (!policies || policies.length === 0) {
        console.log(`No policies expiring in ${days} days`)
        continue
      }

      console.log(`Found ${policies.length} policies expiring in ${days} days`)

      for (const policy of policies as Policy[]) {
        // Check if we've already sent a reminder for this policy and reminder period
        const { data: existingReminder } = await supabaseClient
          .from('policy_renewals')
          .select('id')
          .eq('policy_id', policy.id)
          .eq('reminder_days', days)
          .eq('email_sent', true)
          .single()

        if (existingReminder) {
          console.log(`Reminder already sent for policy ${policy.policy_number} (${days} days)`)
          continue
        }

        // Generate WhatsApp message
        const whatsappMessage = generateWhatsAppMessage(policy, days)
        const whatsappLink = generateWhatsAppLink(policy.vehicle.owner.phone, whatsappMessage)

        // Send email reminder
        const emailSent = await sendEmailReminder(supabaseClient, policy, days, whatsappLink)

        // Record the reminder
        const { error: reminderError } = await supabaseClient
          .from('policy_renewals')
          .insert({
            policy_id: policy.id,
            reminder_days: days,
            email_sent: emailSent,
            whatsapp_link: whatsappLink,
            sent_at: new Date().toISOString()
          })

        if (reminderError) {
          console.error('Error recording reminder:', reminderError)
        } else {
          totalReminders++
          console.log(`Reminder sent for policy ${policy.policy_number} (${days} days before expiry)`)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${totalReminders} renewal reminders` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in renewal-reminder function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function generateWhatsAppMessage(policy: Policy, daysUntilExpiry: number): string {
  const vehicle = `${policy.vehicle.year} ${policy.vehicle.make} ${policy.vehicle.model} (${policy.vehicle.plate})`
  const expiryDate = new Date(policy.end_date).toLocaleDateString('en-GB')
  
  let urgencyText = ''
  if (daysUntilExpiry === 1) {
    urgencyText = '🚨 URGENT: Your insurance expires TOMORROW! '
  } else if (daysUntilExpiry <= 7) {
    urgencyText = '⚠️ IMPORTANT: '
  }

  return `${urgencyText}Hi ${policy.vehicle.owner.full_name}, your ${policy.type.replace('_', ' ')} insurance policy for ${vehicle} expires on ${expiryDate} (in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}). Please contact us to renew your policy and avoid any coverage gaps. Thank you! - Mahardika Insurance`
}

function generateWhatsAppLink(phone: string, message: string): string {
  // Clean phone number (remove any non-digit characters except +)
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

async function sendEmailReminder(
  supabaseClient: any,
  policy: Policy,
  daysUntilExpiry: number,
  whatsappLink: string
): Promise<boolean> {
  try {
    const vehicle = `${policy.vehicle.year} ${policy.vehicle.make} ${policy.vehicle.model} (${policy.vehicle.plate})`
    const expiryDate = new Date(policy.end_date).toLocaleDateString('en-GB')
    
    let subject = ''
    let urgencyClass = 'info'
    
    if (daysUntilExpiry === 1) {
      subject = `🚨 URGENT: Insurance Expires Tomorrow - ${vehicle}`
      urgencyClass = 'critical'
    } else if (daysUntilExpiry <= 7) {
      subject = `⚠️ Insurance Renewal Reminder - ${vehicle} (${daysUntilExpiry} days)`
      urgencyClass = 'warning'
    } else {
      subject = `Insurance Renewal Reminder - ${vehicle} (${daysUntilExpiry} days)`
      urgencyClass = 'info'
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Insurance Renewal Reminder</title>
        <style>
          .email-container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .policy-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .critical { border-left: 4px solid #dc2626; }
          .warning { border-left: 4px solid #f59e0b; }
          .info { border-left: 4px solid #2563eb; }
          .whatsapp-btn { background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px 0; }
          .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Mahardika Insurance</h1>
            <h2>Policy Renewal Reminder</h2>
          </div>
          
          <div class="content">
            <div class="policy-details ${urgencyClass}">
              <h3>Policy Expiring ${daysUntilExpiry === 1 ? 'Tomorrow!' : `in ${daysUntilExpiry} days`}</h3>
              
              <p><strong>Customer:</strong> ${policy.vehicle.owner.full_name}</p>
              <p><strong>Vehicle:</strong> ${vehicle}</p>
              <p><strong>Policy Type:</strong> ${policy.type.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Insurer:</strong> ${policy.insurer}</p>
              <p><strong>Policy Number:</strong> ${policy.policy_number || 'N/A'}</p>
              <p><strong>Expiry Date:</strong> ${expiryDate}</p>
              <p><strong>Premium Amount:</strong> RM ${policy.premium_amount?.toFixed(2) || 'N/A'}</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${whatsappLink}" class="whatsapp-btn">
                📱 Send WhatsApp Reminder
              </a>
            </div>
            
            <p><strong>Action Required:</strong></p>
            <ul>
              <li>Contact the customer to arrange renewal</li>
              <li>Use the WhatsApp link above for quick messaging</li>
              <li>Update policy status in the system once renewed</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This is an automated reminder from Mahardika Insurance Platform</p>
            <p>Generated on ${new Date().toLocaleString('en-GB')}</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Get admin/staff emails to send reminder to
    const { data: staffUsers } = await supabaseClient
      .from('profiles')
      .select('id')
      .in('role', ['admin', 'staff'])

    if (!staffUsers || staffUsers.length === 0) {
      console.log('No admin/staff users found to send email to')
      return false
    }

    // In a real implementation, you would use Supabase's email service or a third-party service
    // For now, we'll log the email content
    console.log('Email would be sent to staff with subject:', subject)
    console.log('WhatsApp link:', whatsappLink)
    
    return true
  } catch (error) {
    console.error('Error sending email reminder:', error)
    return false
  }
} 