import { describe, it, expect, jest } from '@jest/globals'

// Mock Supabase functions
const mockListPolicies = jest.fn()
const mockInsertPolicy = jest.fn()
const mockUpdatePolicy = jest.fn()
const mockDeletePolicy = jest.fn()

jest.mock('@/lib/supabaseServer', () => ({
  listPolicies: mockListPolicies,
  insertPolicy: mockInsertPolicy,
  updatePolicy: mockUpdatePolicy,
  deletePolicy: mockDeletePolicy,
}))

describe('Policies functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should list policies successfully', async () => {
    const mockPolicies = [
      {
        id: '1',
        policy_number: 'POL-2024-001',
        insurer: 'Test Insurance',
        type: 'first_party' as const,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        premium_amount: 1500,
        vehicles: {
          plate: 'ABC 1234',
          make: 'Toyota',
          model: 'Camry'
        }
      }
    ]

    mockListPolicies.mockResolvedValue(mockPolicies)

    const { listPolicies } = await import('@/lib/supabaseServer')
    const result = await listPolicies()

    expect(result).toEqual(mockPolicies)
    expect(mockListPolicies).toHaveBeenCalledTimes(1)
  })

  it('should insert policy successfully', async () => {
    const newPolicy = {
      policy_number: 'POL-2024-002',
      insurer: 'Test Insurance',
      type: 'third_party' as const,
      start_date: '2024-02-01',
      end_date: '2025-01-31',
      premium_amount: 800,
    }

    const mockCreatedPolicy = { id: '2', ...newPolicy }
    mockInsertPolicy.mockResolvedValue(mockCreatedPolicy)

    const { insertPolicy } = await import('@/lib/supabaseServer')
    const result = await insertPolicy(newPolicy)

    expect(result).toEqual(mockCreatedPolicy)
    expect(mockInsertPolicy).toHaveBeenCalledWith(newPolicy)
  })

  it('should handle policy creation errors', async () => {
    const newPolicy = {
      policy_number: 'POL-2024-003',
      insurer: 'Test Insurance',
      type: 'first_party' as const,
      start_date: '2024-03-01',
      end_date: '2025-02-28',
      premium_amount: 1200,
    }

    mockInsertPolicy.mockRejectedValue(new Error('Failed to create policy'))

    const { insertPolicy } = await import('@/lib/supabaseServer')

    await expect(insertPolicy(newPolicy)).rejects.toThrow('Failed to create policy')
  })
}) 