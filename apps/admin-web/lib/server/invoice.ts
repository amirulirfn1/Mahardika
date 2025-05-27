import { createServerSupabaseClient } from './payments'

// Invoice data interface
export interface InvoiceData {
  paymentId: string
  policyNumber: string
  insurer: string
  amount: number
  paidAt: string
  paymentMethod: string
  referenceNumber: string
  customerName?: string
  customerAddress?: string
}

export async function generateInvoicePDF(paymentId: string): Promise<string> {
  try {
    const supabase = createServerSupabaseClient()
    
    // Fetch payment data with related policy information
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        policies (
          policy_number,
          insurer,
          premium_amount,
          vehicles (
            owner_id,
            plate,
            make,
            model
          )
        )
      `)
      .eq('id', paymentId)
      .single()

    if (paymentError || !payment) {
      throw new Error('Payment not found')
    }

    // Fetch customer information if available
    let customerData = null
    if (payment.policies?.vehicles?.owner_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', payment.policies.vehicles.owner_id)
        .single()
      
      customerData = profile
    }

    // Prepare invoice data
    const invoiceData: InvoiceData = {
      paymentId: payment.id,
      policyNumber: payment.policies?.policy_number || 'N/A',
      insurer: payment.policies?.insurer || 'N/A',
      amount: payment.amount,
      paidAt: payment.paid_at,
      paymentMethod: payment.payment_method || 'N/A',
      referenceNumber: payment.reference_number || 'N/A',
      customerName: customerData?.full_name || 'N/A',
    }

    // For now, we'll create a simple HTML-based PDF
    // In a production environment, you'd use @react-pdf/renderer or puppeteer
    const pdfBuffer = await generateHTMLToPDF(invoiceData)
    
    // Upload PDF to Supabase storage
    const fileName = `invoice_${paymentId}.pdf`
    const filePath = `invoices/${fileName}`

    const { data, error } = await supabase.storage
      .from('invoices')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Error uploading invoice PDF:', error)
      throw new Error('Failed to upload invoice PDF')
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('invoices')
      .getPublicUrl(filePath)

    return publicUrl

  } catch (error) {
    console.error('Error generating invoice PDF:', error)
    throw new Error('Failed to generate invoice PDF')
  }
}

// Simplified HTML to PDF generation (placeholder)
// In production, use proper PDF generation library
async function generateHTMLToPDF(invoiceData: InvoiceData): Promise<Buffer> {
  // This is a placeholder implementation
  // In a real application, you would use:
  // 1. @react-pdf/renderer for React-based PDF generation
  // 2. Puppeteer for HTML to PDF conversion
  // 3. PDFKit for programmatic PDF creation
  // 4. Or a dedicated PDF service

  const htmlContent = generateInvoiceHTML(invoiceData)
  
  // For demonstration, we'll create a simple text-based "PDF"
  // In production, replace this with actual PDF generation
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 1000
>>
stream
BT
/F1 24 Tf
100 700 Td
(MAHARDIKA INSURANCE - INVOICE) Tj
0 -50 Td
/F1 12 Tf
(Payment ID: ${invoiceData.paymentId}) Tj
0 -20 Td
(Policy: ${invoiceData.policyNumber}) Tj
0 -20 Td
(Amount: RM ${invoiceData.amount.toFixed(2)}) Tj
0 -20 Td
(Reference: ${invoiceData.referenceNumber}) Tj
0 -20 Td
(Payment Method: ${invoiceData.paymentMethod}) Tj
0 -20 Td
(Date: ${new Date(invoiceData.paidAt).toLocaleDateString()}) Tj
0 -50 Td
(Customer: ${invoiceData.customerName}) Tj
0 -30 Td
(Status: PAID) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000120 00000 n 
0000000179 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
1230
%%EOF`

  return Buffer.from(pdfContent, 'utf-8')
}

// Generate HTML template for invoice
function generateInvoiceHTML(invoiceData: InvoiceData): string {
  const currentDate = new Date().toLocaleDateString()
  const paidDate = new Date(invoiceData.paidAt).toLocaleDateString()
  const totalWithTax = invoiceData.amount * 1.06 // 6% service tax

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice - ${invoiceData.referenceNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #1e40af; }
        .company-info { text-align: right; }
        .invoice-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
        .section { background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .amount-breakdown { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .total-row { border-top: 2px solid #333; padding-top: 10px; font-weight: bold; font-size: 18px; }
        .paid-stamp { background: #10b981; color: white; padding: 15px; text-align: center; font-weight: bold; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="logo">🛡️ MAHARDIKA INSURANCE</div>
            <p>Premium Insurance Services</p>
        </div>
        <div class="company-info">
            <h2>INVOICE</h2>
            <p>Payment Receipt</p>
        </div>
    </div>

    <div class="invoice-info">
        <h3>Invoice Details</h3>
        <p><strong>Reference Number:</strong> ${invoiceData.referenceNumber}</p>
        <p><strong>Invoice Date:</strong> ${currentDate}</p>
        <p><strong>Payment ID:</strong> ${invoiceData.paymentId}</p>
    </div>

    <div class="details-grid">
        <div class="section">
            <h4>Payment Information</h4>
            <p><strong>Amount:</strong> RM ${invoiceData.amount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${invoiceData.paymentMethod.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Date Paid:</strong> ${paidDate}</p>
            <p><strong>Reference:</strong> ${invoiceData.referenceNumber}</p>
        </div>
        
        <div class="section">
            <h4>Policy Information</h4>
            <p><strong>Policy Number:</strong> ${invoiceData.policyNumber}</p>
            <p><strong>Insurer:</strong> ${invoiceData.insurer}</p>
            <p><strong>Customer:</strong> ${invoiceData.customerName}</p>
        </div>
    </div>

    <div class="amount-breakdown">
        <h4>Amount Breakdown</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Premium Amount:</span>
            <span>RM ${invoiceData.amount.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span>Service Tax (6%):</span>
            <span>RM ${(invoiceData.amount * 0.06).toFixed(2)}</span>
        </div>
        <div class="total-row" style="display: flex; justify-content: space-between;">
            <span>Total Amount:</span>
            <span>RM ${totalWithTax.toFixed(2)}</span>
        </div>
    </div>

    <div class="paid-stamp">
        ✅ PAYMENT RECEIVED - THANK YOU
    </div>

    <div class="footer">
        <p>This is a computer-generated invoice. For inquiries, please contact our customer service.</p>
        <p>Mahardika Insurance Sdn Bhd | +60 3-1234 5678 | info@mahardika.my</p>
    </div>
</body>
</html>`
} 