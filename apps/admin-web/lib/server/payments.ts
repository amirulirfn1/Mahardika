import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { generateInvoicePDF } from './invoice'

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Payment helpers
export async function listPayments(policyId?: string) {
  const supabase = createServerSupabaseClient()
  
  let query = supabase
    .from('payments')
    .select(`
      *,
      policies (
        policy_number,
        insurer,
        premium_amount
      )
    `)
    .order('created_at', { ascending: false })

  if (policyId) {
    query = query.eq('policy_id', policyId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching payments:', error)
    throw new Error('Failed to fetch payments')
  }

  return data
}

export async function insertPayment(paymentData: {
  policy_id: string
  amount: number
  paid_at: string
  payment_method: string
  reference_number: string
  proof_url?: string
}) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single()

  if (error) {
    console.error('Error inserting payment:', error)
    throw new Error('Failed to create payment')
  }

  // Generate invoice PDF after successful payment insertion
  try {
    const invoiceUrl = await generateInvoicePDF(data.id)
    
    // Update payment record with invoice URL
    const { error: updateError } = await supabase
      .from('payments')
      .update({ invoice_url: invoiceUrl })
      .eq('id', data.id)

    if (updateError) {
      console.error('Error updating payment with invoice URL:', updateError)
      // Don't throw here, payment was created successfully
    }

    // TODO: Trigger loyalty points calculation
    await triggerLoyaltyPointsCalculation(data.policy_id, data.amount)

    return { ...data, invoice_url: invoiceUrl }
  } catch (invoiceError) {
    console.error('Error generating invoice:', invoiceError)
    // Return payment data even if invoice generation failed
    return data
  }
}

export async function updatePayment(id: string, paymentData: Partial<{
  amount: number
  paid_at: string
  payment_method: string
  reference_number: string
  proof_url: string
  invoice_url: string
}>) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('payments')
    .update(paymentData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating payment:', error)
    throw new Error('Failed to update payment')
  }

  return data
}

export async function deletePayment(id: string) {
  const supabase = createServerSupabaseClient()
  
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting payment:', error)
    throw new Error('Failed to delete payment')
  }
}

// File upload helper for payment proof
export async function uploadPaymentProof(file: File, paymentId: string) {
  const supabase = createServerSupabaseClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${paymentId}_proof.${fileExt}`
  const filePath = `payment-proofs/${fileName}`

  const { data, error } = await supabase.storage
    .from('payments')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    console.error('Error uploading payment proof:', error)
    throw new Error('Failed to upload payment proof')
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('payments')
    .getPublicUrl(filePath)

  return publicUrl
}

// Helper to get payment statistics
export async function getPaymentStats(startDate?: string, endDate?: string) {
  const supabase = createServerSupabaseClient()
  
  let query = supabase
    .from('payments')
    .select('amount, created_at')

  if (startDate) {
    query = query.gte('created_at', startDate)
  }
  if (endDate) {
    query = query.lte('created_at', endDate)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching payment stats:', error)
    throw new Error('Failed to fetch payment statistics')
  }

  const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0)
  const totalCount = data.length
  const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0

  return {
    totalAmount,
    totalCount,
    averageAmount,
    payments: data
  }
}

// Loyalty points calculation (placeholder)
async function triggerLoyaltyPointsCalculation(policyId: string, amount: number) {
  // TODO: Implement loyalty points calculation
  // This would typically:
  // 1. Get the policy owner
  // 2. Calculate points based on payment amount
  // 3. Insert into points_ledger table
  // 4. Update user's total points
  
  console.log(`TODO: Calculate loyalty points for policy ${policyId}, amount ${amount}`)
} 