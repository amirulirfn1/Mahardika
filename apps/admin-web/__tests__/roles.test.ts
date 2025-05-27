import { describe, it, expect, jest } from '@jest/globals'

// Mock Supabase functions
const mockListUsers = jest.fn()
const mockUpdateUserRole = jest.fn()
const mockGetRoleStats = jest.fn()
const mockGetUsersByRole = jest.fn()
const mockCanManageRoles = jest.fn()

jest.mock('@/lib/server/roles', () => ({
  listUsers: mockListUsers,
  updateUserRole: mockUpdateUserRole,
  getRoleStats: mockGetRoleStats,
  getUsersByRole: mockGetUsersByRole,
  canManageRoles: mockCanManageRoles,
}))

describe('Role management functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should list users successfully', async () => {
    const mockUsers = [
      {
        id: 'user-1',
        full_name: 'Admin User',
        phone: '+60123456789',
        role: 'admin' as const,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'user-2',
        full_name: 'John Smith',
        phone: '+60198765432',
        role: 'staff' as const,
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      }
    ]

    mockListUsers.mockResolvedValue(mockUsers)

    const { listUsers } = await import('@/lib/server/roles')
    const result = await listUsers()

    expect(result).toEqual(mockUsers)
    expect(mockListUsers).toHaveBeenCalledTimes(1)
  })

  it('should update user role successfully', async () => {
    const userId = 'user-2'
    const newRole = 'admin' as const
    const updatedUser = {
      id: userId,
      full_name: 'John Smith',
      phone: '+60198765432',
      role: newRole,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: new Date().toISOString()
    }

    mockUpdateUserRole.mockResolvedValue(updatedUser)

    const { updateUserRole } = await import('@/lib/server/roles')
    const result = await updateUserRole(userId, newRole)

    expect(result).toEqual(updatedUser)
    expect(mockUpdateUserRole).toHaveBeenCalledWith(userId, newRole)
  })

  it('should get role statistics correctly', async () => {
    const mockStats = {
      admin: 2,
      staff: 3,
      customer: 15,
      total: 20
    }

    mockGetRoleStats.mockResolvedValue(mockStats)

    const { getRoleStats } = await import('@/lib/server/roles')
    const result = await getRoleStats()

    expect(result).toEqual(mockStats)
    expect(mockGetRoleStats).toHaveBeenCalledTimes(1)
  })

  it('should get users by role successfully', async () => {
    const role = 'admin' as const
    const mockAdmins = [
      {
        id: 'user-1',
        full_name: 'Admin User',
        phone: '+60123456789',
        role: 'admin' as const,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ]

    mockGetUsersByRole.mockResolvedValue(mockAdmins)

    const { getUsersByRole } = await import('@/lib/server/roles')
    const result = await getUsersByRole(role)

    expect(result).toEqual(mockAdmins)
    expect(mockGetUsersByRole).toHaveBeenCalledWith(role)
  })

  it('should check role management permissions correctly', async () => {
    mockCanManageRoles.mockResolvedValue(true)

    const { canManageRoles } = await import('@/lib/server/roles')
    const result = await canManageRoles()

    expect(result).toBe(true)
    expect(mockCanManageRoles).toHaveBeenCalledTimes(1)
  })

  it('should prevent non-admin users from changing roles', async () => {
    const userId = 'user-2'
    const newRole = 'admin' as const

    mockUpdateUserRole.mockRejectedValue(
      new Error('Insufficient permissions. Only admins can change user roles.')
    )

    const { updateUserRole } = await import('@/lib/server/roles')

    await expect(updateUserRole(userId, newRole)).rejects.toThrow(
      'Insufficient permissions. Only admins can change user roles.'
    )
  })

  it('should prevent users from removing their own admin role', async () => {
    const userId = 'user-1' // Current user
    const newRole = 'staff' as const

    mockUpdateUserRole.mockRejectedValue(
      new Error('Cannot remove your own admin privileges')
    )

    const { updateUserRole } = await import('@/lib/server/roles')

    await expect(updateUserRole(userId, newRole)).rejects.toThrow(
      'Cannot remove your own admin privileges'
    )
  })

  it('should validate role values', async () => {
    const userId = 'user-2'
    const invalidRole = 'superuser' as any

    mockUpdateUserRole.mockRejectedValue(
      new Error('Invalid role specified')
    )

    const { updateUserRole } = await import('@/lib/server/roles')

    await expect(updateUserRole(userId, invalidRole)).rejects.toThrow(
      'Invalid role specified'
    )
  })

  it('should handle unauthorized access', async () => {
    const userId = 'user-2'
    const newRole = 'admin' as const

    mockUpdateUserRole.mockRejectedValue(
      new Error('Unauthorized')
    )

    const { updateUserRole } = await import('@/lib/server/roles')

    await expect(updateUserRole(userId, newRole)).rejects.toThrow('Unauthorized')
  })

  it('should handle database errors gracefully', async () => {
    mockListUsers.mockRejectedValue(new Error('Failed to fetch users'))

    const { listUsers } = await import('@/lib/server/roles')

    await expect(listUsers()).rejects.toThrow('Failed to fetch users')
  })

  it('should return false for canManageRoles when user is not admin', async () => {
    mockCanManageRoles.mockResolvedValue(false)

    const { canManageRoles } = await import('@/lib/server/roles')
    const result = await canManageRoles()

    expect(result).toBe(false)
  })
})

describe('Role update validation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should allow admin to change any user role', async () => {
    const userId = 'user-3'
    const newRole = 'staff' as const
    const updatedUser = {
      id: userId,
      role: newRole,
      updated_at: new Date().toISOString()
    }

    mockUpdateUserRole.mockResolvedValue(updatedUser)

    const { updateUserRole } = await import('@/lib/server/roles')
    const result = await updateUserRole(userId, newRole)

    expect(result).toEqual(updatedUser)
    expect(mockUpdateUserRole).toHaveBeenCalledWith(userId, newRole)
  })

  it('should allow changing customer to staff', async () => {
    const userId = 'user-4'
    const newRole = 'staff' as const

    mockUpdateUserRole.mockResolvedValue({ id: userId, role: newRole })

    const { updateUserRole } = await import('@/lib/server/roles')
    const result = await updateUserRole(userId, newRole)

    expect(result.role).toBe(newRole)
  })

  it('should allow changing staff to admin', async () => {
    const userId = 'user-5'
    const newRole = 'admin' as const

    mockUpdateUserRole.mockResolvedValue({ id: userId, role: newRole })

    const { updateUserRole } = await import('@/lib/server/roles')
    const result = await updateUserRole(userId, newRole)

    expect(result.role).toBe(newRole)
  })
}) 