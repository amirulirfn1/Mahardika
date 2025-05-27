import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

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

// Policy helpers
export async function listPolicies() {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('policies')
    .select(`
      *,
      vehicles (
        plate,
        make,
        model
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching policies:', error)
    throw new Error('Failed to fetch policies')
  }

  return data
}

export async function insertPolicy(policyData: {
  policy_number: string
  insurer: string
  type: 'first_party' | 'third_party'
  start_date: string
  end_date: string
  premium_amount: number
  vehicle_id?: string
  pdf_url?: string
}) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('policies')
    .insert(policyData)
    .select()
    .single()

  if (error) {
    console.error('Error inserting policy:', error)
    throw new Error('Failed to create policy')
  }

  return data
}

export async function updatePolicy(id: string, policyData: Partial<{
  policy_number: string
  insurer: string
  type: 'first_party' | 'third_party'
  start_date: string
  end_date: string
  premium_amount: number
  vehicle_id: string
  pdf_url: string
}>) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('policies')
    .update(policyData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating policy:', error)
    throw new Error('Failed to update policy')
  }

  return data
}

export async function deletePolicy(id: string) {
  const supabase = createServerSupabaseClient()
  
  const { error } = await supabase
    .from('policies')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting policy:', error)
    throw new Error('Failed to delete policy')
  }
}

// Vehicle helpers
export async function listVehicles() {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vehicles:', error)
    throw new Error('Failed to fetch vehicles')
  }

  return data
}

export async function insertVehicle(vehicleData: {
  plate: string
  make: string
  model: string
  year: number
  owner_id?: string
}) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('vehicles')
    .insert(vehicleData)
    .select()
    .single()

  if (error) {
    console.error('Error inserting vehicle:', error)
    throw new Error('Failed to create vehicle')
  }

  return data
}

export async function updateVehicle(id: string, vehicleData: Partial<{
  plate: string
  make: string
  model: string
  year: number
  owner_id: string
}>) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('vehicles')
    .update(vehicleData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating vehicle:', error)
    throw new Error('Failed to update vehicle')
  }

  return data
}

export async function deleteVehicle(id: string) {
  const supabase = createServerSupabaseClient()
  
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting vehicle:', error)
    throw new Error('Failed to delete vehicle')
  }
}

// File upload helper
export async function uploadPolicyDocument(file: File, policyId: string) {
  const supabase = createServerSupabaseClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${policyId}.${fileExt}`
  const filePath = `policies/${fileName}`

  const { data, error } = await supabase.storage
    .from('policies')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload document')
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('policies')
    .getPublicUrl(filePath)

  return publicUrl
} 