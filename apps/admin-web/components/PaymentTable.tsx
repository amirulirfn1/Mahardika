"use client"

import * as React from "react"
import { Search, Plus, Download, Eye, Receipt, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Payment {
  id: string
  policyId: string
  policyNumber: string
  amount: number
  paidAt: string
  paymentMethod: string
  referenceNumber: string
  proofUrl?: string
  invoiceUrl?: string
  status: "completed" | "pending" | "failed"
}

interface PaymentTableProps {
  payments: Payment[]
  onNewPayment?: () => void
  onViewInvoice?: (payment: Payment) => void
  isReadOnly?: boolean
}

const statusVariants = {
  completed: "default",
  pending: "secondary", 
  failed: "destructive",
} as const

const paymentMethodIcons = {
  "bank_transfer": Receipt,
  "online_banking": FileText,
  "card": Receipt,
  "cash": Receipt,
} as const

export function PaymentTable({
  payments,
  onNewPayment,
  onViewInvoice,
  isReadOnly = false,
}: PaymentTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredPayments = React.useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch = 
        payment.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || payment.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [payments, searchTerm, statusFilter])

  const handleDownloadProof = (proofUrl: string) => {
    window.open(proofUrl, '_blank')
  }

  const handleDownloadInvoice = (invoiceUrl: string) => {
    window.open(invoiceUrl, '_blank')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payments</CardTitle>
          {!isReadOnly && (
            <Button onClick={onNewPayment}>
              <Plus className="h-4 w-4 mr-2" />
              New Payment
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "failed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("failed")}
            >
              Failed
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Number</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Paid At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.policyNumber}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{payment.referenceNumber}</TableCell>
                <TableCell>{new Date(payment.paidAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={statusVariants[payment.status]}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {payment.proofUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadProof(payment.proofUrl!)}
                        title="Download Payment Proof"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {payment.invoiceUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(payment.invoiceUrl!)}
                        title="Download Invoice"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    {payment.invoiceUrl && onViewInvoice && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewInvoice(payment)}
                        title="Preview Invoice"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No payments found
          </div>
        )}
      </CardContent>
    </Card>
  )
} 