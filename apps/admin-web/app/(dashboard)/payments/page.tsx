"use client"

import * as React from "react"
import { PaymentTable, type Payment } from "@/components/PaymentTable"
import { PaymentForm, type PaymentFormData, type Policy } from "@/components/PaymentForm"
import { InvoicePreviewDialog } from "@/components/InvoicePreviewDialog"
import { toast } from "sonner"

// Mock data for development - replace with actual data fetching
const mockPayments: Payment[] = [
  {
    id: "1",
    policyId: "pol-1",
    policyNumber: "POL-2024-001",
    amount: 1500.00,
    paidAt: "2024-01-15",
    paymentMethod: "bank_transfer",
    referenceNumber: "TXN-2024-001",
    status: "completed",
    proofUrl: "https://example.com/proof1.pdf",
    invoiceUrl: "https://example.com/invoice1.pdf"
  },
  {
    id: "2",
    policyId: "pol-2",
    policyNumber: "POL-2024-002",
    amount: 800.00,
    paidAt: "2024-01-10",
    paymentMethod: "online_banking",
    referenceNumber: "TXN-2024-002",
    status: "completed",
    proofUrl: "https://example.com/proof2.jpg",
    invoiceUrl: "https://example.com/invoice2.pdf"
  },
  {
    id: "3",
    policyId: "pol-3",
    policyNumber: "POL-2024-003",
    amount: 1200.00,
    paidAt: "2024-01-20",
    paymentMethod: "card",
    referenceNumber: "TXN-2024-003",
    status: "pending",
    proofUrl: "https://example.com/proof3.png"
  }
]

const mockPolicies: Policy[] = [
  {
    id: "pol-1",
    policy_number: "POL-2024-001",
    premium_amount: 1500.00
  },
  {
    id: "pol-2", 
    policy_number: "POL-2024-002",
    premium_amount: 800.00
  },
  {
    id: "pol-3",
    policy_number: "POL-2024-003", 
    premium_amount: 1200.00
  },
  {
    id: "pol-4",
    policy_number: "POL-2024-004",
    premium_amount: 950.00
  }
]

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>(mockPayments)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = React.useState(false)
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null)

  const handleNewPayment = () => {
    setIsFormOpen(true)
  }

  const handleViewInvoice = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsInvoicePreviewOpen(true)
  }

  const handleSubmitPayment = async (data: PaymentFormData) => {
    try {
      // Find the selected policy to get policy number
      const selectedPolicy = mockPolicies.find(p => p.id === data.policyId)
      
      // Create new payment
      const newPayment: Payment = {
        id: Date.now().toString(), // Temporary ID
        policyId: data.policyId,
        policyNumber: selectedPolicy?.policy_number || `POL-${Date.now()}`,
        amount: parseFloat(data.amount),
        paidAt: data.paidAt,
        paymentMethod: data.paymentMethod,
        referenceNumber: data.referenceNumber,
        status: "pending", // Default status for new payments
        proofUrl: data.proofFile ? URL.createObjectURL(data.proofFile) : undefined,
        // TODO: Generate invoice URL via server action
        // invoiceUrl: will be set after invoice generation
      }
      
      setPayments(prev => [newPayment, ...prev])
      toast.success("Payment recorded successfully")
      
      // TODO: Call server action to:
      // 1. Upload proof file to Supabase storage
      // 2. Insert payment record to database
      // 3. Generate invoice PDF
      // 4. Trigger loyalty points calculation
      
      setIsFormOpen(false)
    } catch (error) {
      toast.error("Failed to record payment")
      console.error("Payment submission error:", error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">
          Record and manage insurance premium payments
        </p>
      </div>

      <PaymentTable
        payments={payments}
        onNewPayment={handleNewPayment}
        onViewInvoice={handleViewInvoice}
      />

      <PaymentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitPayment}
        policies={mockPolicies}
      />

      <InvoicePreviewDialog
        open={isInvoicePreviewOpen}
        onOpenChange={setIsInvoicePreviewOpen}
        payment={selectedPayment}
      />
    </div>
  )
} 