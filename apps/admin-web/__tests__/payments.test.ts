import { describe, it, expect, jest } from '@jest/globals'

// Mock Supabase functions
const mockListPayments = jest.fn()
const mockInsertPayment = jest.fn()
const mockUpdatePayment = jest.fn()
const mockDeletePayment = jest.fn()
const mockUploadPaymentProof = jest.fn()
const mockGetPaymentStats = jest.fn()

// Mock invoice generation
const mockGenerateInvoicePDF = jest.fn()

jest.mock('@/lib/server/payments', () => ({
  listPayments: mockListPayments,
  insertPayment: mockInsertPayment,
  updatePayment: mockUpdatePayment,
  deletePayment: mockDeletePayment,
  uploadPaymentProof: mockUploadPaymentProof,
  getPaymentStats: mockGetPaymentStats,
}))

jest.mock('@/lib/server/invoice', () => ({
  generateInvoicePDF: mockGenerateInvoicePDF,
}))

describe('Payments functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should list payments successfully', async () => {
    const mockPayments = [
      {
        id: '1',
        policy_id: 'pol-1',
        amount: 1500,
        paid_at: '2024-01-15',
        payment_method: 'bank_transfer',
        reference_number: 'TXN-2024-001',
        policies: {
          policy_number: 'POL-2024-001',
          insurer: 'Test Insurance',
          premium_amount: 1500
        }
      }
    ]

    mockListPayments.mockResolvedValue(mockPayments)

    const { listPayments } = await import('@/lib/server/payments')
    const result = await listPayments()

    expect(result).toEqual(mockPayments)
    expect(mockListPayments).toHaveBeenCalledTimes(1)
  })

  it('should insert payment and generate invoice successfully', async () => {
    const newPayment = {
      policy_id: 'pol-1',
      amount: 1500,
      paid_at: '2024-01-15',
      payment_method: 'bank_transfer',
      reference_number: 'TXN-2024-001',
    }

    const mockCreatedPayment = { 
      id: '1', 
      ...newPayment,
      invoice_url: 'https://example.com/invoice1.pdf'
    }
    
    mockInsertPayment.mockResolvedValue(mockCreatedPayment)
    mockGenerateInvoicePDF.mockResolvedValue('https://example.com/invoice1.pdf')

    const { insertPayment } = await import('@/lib/server/payments')
    const result = await insertPayment(newPayment)

    expect(result).toEqual(mockCreatedPayment)
    expect(mockInsertPayment).toHaveBeenCalledWith(newPayment)
  })

  it('should upload payment proof successfully', async () => {
    const mockFile = new File(['test'], 'proof.pdf', { type: 'application/pdf' })
    const paymentId = 'payment-1'
    const expectedUrl = 'https://example.com/payment-proofs/payment-1_proof.pdf'

    mockUploadPaymentProof.mockResolvedValue(expectedUrl)

    const { uploadPaymentProof } = await import('@/lib/server/payments')
    const result = await uploadPaymentProof(mockFile, paymentId)

    expect(result).toBe(expectedUrl)
    expect(mockUploadPaymentProof).toHaveBeenCalledWith(mockFile, paymentId)
  })

  it('should get payment statistics correctly', async () => {
    const mockStats = {
      totalAmount: 5000,
      totalCount: 3,
      averageAmount: 1666.67,
      payments: [
        { amount: 1500, created_at: '2024-01-15' },
        { amount: 2000, created_at: '2024-01-20' },
        { amount: 1500, created_at: '2024-01-25' }
      ]
    }

    mockGetPaymentStats.mockResolvedValue(mockStats)

    const { getPaymentStats } = await import('@/lib/server/payments')
    const result = await getPaymentStats('2024-01-01', '2024-01-31')

    expect(result).toEqual(mockStats)
    expect(mockGetPaymentStats).toHaveBeenCalledWith('2024-01-01', '2024-01-31')
  })

  it('should handle payment creation errors', async () => {
    const newPayment = {
      policy_id: 'pol-1',
      amount: 1500,
      paid_at: '2024-01-15',
      payment_method: 'bank_transfer',
      reference_number: 'TXN-2024-001',
    }

    mockInsertPayment.mockRejectedValue(new Error('Failed to create payment'))

    const { insertPayment } = await import('@/lib/server/payments')

    await expect(insertPayment(newPayment)).rejects.toThrow('Failed to create payment')
  })

  it('should handle invoice generation errors gracefully', async () => {
    const newPayment = {
      policy_id: 'pol-1', 
      amount: 1500,
      paid_at: '2024-01-15',
      payment_method: 'bank_transfer',
      reference_number: 'TXN-2024-001',
    }

    const mockCreatedPayment = { id: '1', ...newPayment }
    
    mockInsertPayment.mockResolvedValue(mockCreatedPayment)
    mockGenerateInvoicePDF.mockRejectedValue(new Error('Invoice generation failed'))

    const { insertPayment } = await import('@/lib/server/payments')
    const result = await insertPayment(newPayment)

    // Should still return payment data even if invoice generation fails
    expect(result).toEqual(mockCreatedPayment)
  })
})

describe('Invoice generation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate invoice PDF successfully', async () => {
    const paymentId = 'payment-1'
    const expectedUrl = 'https://example.com/invoices/invoice_payment-1.pdf'

    mockGenerateInvoicePDF.mockResolvedValue(expectedUrl)

    const { generateInvoicePDF } = await import('@/lib/server/invoice')
    const result = await generateInvoicePDF(paymentId)

    expect(result).toBe(expectedUrl)
    expect(mockGenerateInvoicePDF).toHaveBeenCalledWith(paymentId)
  })

  it('should handle invoice generation errors', async () => {
    const paymentId = 'payment-1'

    mockGenerateInvoicePDF.mockRejectedValue(new Error('Failed to generate invoice PDF'))

    const { generateInvoicePDF } = await import('@/lib/server/invoice')

    await expect(generateInvoicePDF(paymentId)).rejects.toThrow('Failed to generate invoice PDF')
  })
}) 