"use client"

import * as React from "react"
import { Download, X, FileText, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Payment } from "./PaymentTable"

interface InvoicePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment | null
}

export function InvoicePreviewDialog({
  open,
  onOpenChange,
  payment,
}: InvoicePreviewDialogProps) {
  const handleDownload = () => {
    if (payment?.invoiceUrl) {
      window.open(payment.invoiceUrl, '_blank')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!payment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Invoice Preview</span>
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!payment.invoiceUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>

        {/* Invoice Preview Content */}
        <div className="bg-white border rounded-lg p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mahardika Insurance</h2>
                <p className="text-sm text-gray-500">Premium Insurance Services</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-900">INVOICE</h3>
              <p className="text-sm text-gray-500">Payment Receipt</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference:</span>
                  <span className="font-mono">{payment.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date Paid:</span>
                  <span>{formatDate(payment.paidAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Method:</span>
                  <span className="capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Policy Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Policy Number:</span>
                  <span className="font-mono">{payment.policyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Policy ID:</span>
                  <span className="font-mono text-xs">{payment.policyId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Amount Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Premium Amount:</span>
                <span>{formatCurrency(payment.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Tax (6%):</span>
                <span>{formatCurrency(payment.amount * 0.06)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-lg">{formatCurrency(payment.amount * 1.06)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">PAYMENT RECEIVED</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              This payment has been successfully processed and recorded.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 text-center">
            <p className="text-xs text-gray-500">
              This is a computer-generated invoice. For inquiries, please contact our customer service.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Mahardika Insurance Sdn Bhd | +60 3-1234 5678 | info@mahardika.my
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleDownload} disabled={!payment.invoiceUrl}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 