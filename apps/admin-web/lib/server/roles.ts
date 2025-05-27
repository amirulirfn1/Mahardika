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

// Role management helpers
export async function listUsers() {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }

  return data
}

export async function updateUserRole(
  userId: string, 
  newRole: 'admin' | 'staff' | 'customer',
  updatedBy?: string
) {
  const supabase = createServerSupabaseClient()
  
  // Validate that the new role is valid
  const validRoles = ['admin', 'staff', 'customer']
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role specified')
  }

  // Get current user to check permissions
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Check if current user has admin privileges
  const { data: currentUserProfile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || currentUserProfile?.role !== 'admin') {
    throw new Error('Insufficient permissions. Only admins can change user roles.')
  }

  // Prevent users from removing their own admin role
  if (userId === user.id && currentUserProfile.role === 'admin' && newRole !== 'admin') {
    throw new Error('Cannot remove your own admin privileges')
  }

  // Update the user's role
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      role: newRole,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user role:', error)
    throw new Error('Failed to update user role')
  }

  // Log the role change for audit purposes
  await logRoleChange(userId, newRole, user.id)

  return data
}

export async function getRoleStats() {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')

  if (error) {
    console.error('Error fetching role stats:', error)
    throw new Error('Failed to fetch role statistics')
  }

  const stats = data.reduce((acc, profile) => {
    acc[profile.role] = (acc[profile.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    admin: stats.admin || 0,
    staff: stats.staff || 0,
    customer: stats.customer || 0,
    total: data.length
  }
}

export async function getUsersByRole(role: 'admin' | 'staff' | 'customer') {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users by role:', error)
    throw new Error(`Failed to fetch ${role}s`)
  }

  return data
}

// Helper to log role changes for audit trail
async function logRoleChange(
  targetUserId: string, 
  newRole: string, 
  changedBy: string
) {
  const supabase = createServerSupabaseClient()
  
  // This would typically go to an audit log table
  // For now, we'll just log to console
  console.log(`Role change: User ${targetUserId} role changed to ${newRole} by ${changedBy}`)
  
  // TODO: Implement proper audit logging
  // const { error } = await supabase
  //   .from('audit_logs')
  //   .insert({
  //     action: 'role_change',
  //     target_user_id: targetUserId,
  //     new_value: newRole,
  //     changed_by: changedBy,
  //     timestamp: new Date().toISOString()
  //   })
}

// RPC function to update role (can be called directly from client)
export async function updateRoleRPC(userId: string, newRole: 'admin' | 'staff' | 'customer') {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase.rpc('update_user_role', {
    target_user_id: userId,
    new_role: newRole
  })

  if (error) {
    console.error('Error calling update_user_role RPC:', error)
    throw new Error('Failed to update user role via RPC')
  }

  return data
}

// Check if current user can manage roles
export async function canManageRoles(): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return false
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return false
  }

  return profile.role === 'admin'
} 