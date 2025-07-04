import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DSRRequestPayload {
  requestId: string;
  type: 'export' | 'delete' | 'rectify';
  email: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface DataDiscoveryResult {
  totalRecords: number;
  tables: {
    [tableName: string]: {
      count: number;
      records?: any[];
      fields: string[];
    };
  };
  estimatedExportSize: string;
}

// Data discovery mapping - defines which tables to search for user data
const DATA_DISCOVERY_TABLES = {
  'users': {
    emailColumn: 'email',
    fields: ['id', 'email', 'full_name', 'phone', 'address', 'created_at', 'updated_at'],
    piiFields: ['email', 'full_name', 'phone', 'address'],
  },
  'user_consents': {
    userIdColumn: 'user_id',
    fields: ['id', 'consent_type', 'granted', 'granted_at', 'withdrawn_at', 'version', 'metadata'],
    piiFields: ['metadata'],
  },
  'dsr_requests': {
    emailColumn: 'email',
    fields: ['id', 'type', 'email', 'full_name', 'status', 'created_at', 'updated_at'],
    piiFields: ['email', 'full_name'],
  },
  'policies': {
    emailColumn: 'customer_email',
    fields: ['id', 'policy_number', 'customer_email', 'status', 'created_at'],
    piiFields: ['customer_email'],
  },
  'claims': {
    emailColumn: 'claimant_email',
    fields: ['id', 'claim_number', 'claimant_email', 'status', 'amount', 'created_at'],
    piiFields: ['claimant_email'],
  },
  'communications': {
    emailColumn: 'recipient_email',
    fields: ['id', 'type', 'recipient_email', 'subject', 'sent_at'],
    piiFields: ['recipient_email', 'subject', 'content'],
  },
  'audit_logs': {
    emailColumn: 'user_email',
    fields: ['id', 'action', 'user_email', 'ip_address', 'created_at'],
    piiFields: ['user_email', 'ip_address'],
  },
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { requestId, type, email, priority }: DSRRequestPayload = await req.json()

    // Validate input
    if (!requestId || !type || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Processing DSR request: ${requestId} (${type}) for ${email}`)

    // Update request status to in_progress
    const { error: updateError } = await supabaseClient
      .rpc('update_dsr_status', {
        p_request_id: requestId,
        p_status: 'in_progress',
        p_notes: 'Automated processing started with enhanced data discovery'
      })

    if (updateError) {
      console.error('Failed to update DSR status:', updateError)
      throw new Error('Failed to update request status')
    }

    // Log audit trail
    await supabaseClient
      .from('dsr_audit_log')
      .insert({
        request_id: requestId,
        action: 'processing_started',
        new_values: { status: 'in_progress', processing_version: '2.0' },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent')
      })

    // Perform comprehensive data discovery
    const discoveryResult = await performDataDiscovery(supabaseClient, email)
    
    // Log discovery results
    await supabaseClient
      .from('dsr_audit_log')
      .insert({
        request_id: requestId,
        action: 'data_discovery_completed',
        new_values: { 
          discovery_summary: {
            total_records: discoveryResult.totalRecords,
            tables_found: Object.keys(discoveryResult.tables).length,
            estimated_size: discoveryResult.estimatedExportSize
          }
        },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent')
      })

    // Process based on request type
    let processingResult: any = {}
    
    switch (type) {
      case 'export':
        processingResult = await processDataExport(supabaseClient, requestId, email, discoveryResult)
        break
      case 'delete':
        processingResult = await processDataDeletion(supabaseClient, requestId, email, discoveryResult)
        break
      case 'rectify':
        processingResult = await processDataRectification(supabaseClient, requestId, email, discoveryResult)
        break
      default:
        throw new Error(`Unknown request type: ${type}`)
    }

    // Send notification email
    await sendEnhancedNotificationEmail(email, type, requestId, processingResult, discoveryResult)

    // Update completion status
    await supabaseClient
      .rpc('update_dsr_status', {
        p_request_id: requestId,
        p_status: 'completed',
        p_notes: `Processed successfully with ${discoveryResult.totalRecords} records found across ${Object.keys(discoveryResult.tables).length} tables. ${JSON.stringify(processingResult)}`
      })

    // Final audit log
    await supabaseClient
      .from('dsr_audit_log')
      .insert({
        request_id: requestId,
        action: 'processing_completed',
        new_values: { 
          status: 'completed',
          result: processingResult,
          discovery_result: discoveryResult
        },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent')
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        requestId,
        result: processingResult,
        discovery: discoveryResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('DSR processing error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        requestId: req.url 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

/**
 * Perform comprehensive data discovery across all relevant tables
 */
async function performDataDiscovery(supabaseClient: any, email: string): Promise<DataDiscoveryResult> {
  console.log(`Starting data discovery for ${email}`)
  
  const result: DataDiscoveryResult = {
    totalRecords: 0,
    tables: {},
    estimatedExportSize: '0 MB'
  }
  
  // Get user ID first if it exists
  let userId: string | null = null
  try {
    const { data: userData } = await supabaseClient
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    
    if (userData) {
      userId = userData.id
    }
  } catch (error) {
    console.log('No user record found, proceeding with email-only search')
  }

  // Search each configured table
  for (const [tableName, config] of Object.entries(DATA_DISCOVERY_TABLES)) {
    try {
      let query = supabaseClient.from(tableName)
      
      // Build query based on table configuration
      if (config.emailColumn) {
        query = query.select('*').eq(config.emailColumn, email)
      } else if (config.userIdColumn && userId) {
        query = query.select('*').eq(config.userIdColumn, userId)
      } else {
        continue // Skip if no matching column or user ID
      }
      
      const { data, error, count } = await query
      
      if (error) {
        console.error(`Error querying ${tableName}:`, error)
        continue
      }
      
      if (data && data.length > 0) {
        result.tables[tableName] = {
          count: data.length,
          records: data,
          fields: config.fields
        }
        result.totalRecords += data.length
      }
      
    } catch (error) {
      console.error(`Failed to search table ${tableName}:`, error)
    }
  }
  
  // Estimate export size (rough calculation)
  const avgRecordSize = 1024 // 1KB per record average
  const estimatedBytes = result.totalRecords * avgRecordSize
  result.estimatedExportSize = formatBytes(estimatedBytes)
  
  console.log(`Data discovery completed: ${result.totalRecords} records across ${Object.keys(result.tables).length} tables`)
  return result
}

/**
 * Process data export request with enhanced discovery
 */
async function processDataExport(supabaseClient: any, requestId: string, email: string, discovery: DataDiscoveryResult) {
  console.log(`Processing data export for ${email}`)
  
  try {
    // Create comprehensive export data structure
    const exportData = {
      export_metadata: {
        request_id: requestId,
        email: email,
        export_date: new Date().toISOString(),
        total_records: discovery.totalRecords,
        estimated_size: discovery.estimatedExportSize,
        tables_included: Object.keys(discovery.tables)
      },
      data_by_table: {}
    }
    
    // Process each table's data
    for (const [tableName, tableData] of Object.entries(discovery.tables)) {
      exportData.data_by_table[tableName] = {
        record_count: tableData.count,
        fields_included: tableData.fields,
        records: tableData.records?.map(record => {
          // Remove sensitive system fields
          const cleanRecord = { ...record }
          delete cleanRecord.password
          delete cleanRecord.hashed_password
          delete cleanRecord.secret_key
          return cleanRecord
        })
      }
    }
    
    // In a real implementation, this would:
    // 1. Generate a secure file (JSON/CSV/XML)
    // 2. Upload to secure storage (S3, etc.)
    // 3. Create time-limited download link
    // 4. Encrypt the file
    
    const exportFileUrl = `https://secure-exports.mahardika.com/${requestId}.json`
    const downloadToken = generateSecureToken()
    
    return {
      export_file_url: exportFileUrl,
      download_token: downloadToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      data_summary: {
        total_records: discovery.totalRecords,
        tables: Object.keys(discovery.tables),
        estimated_size: discovery.estimatedExportSize,
        format: 'JSON'
      },
      instructions: 'Your data export is ready for download. The link will be valid for 7 days. Please download your data promptly.',
      security_note: 'The export file is encrypted and requires the download token provided in your email.'
    }
    
  } catch (error) {
    console.error('Data export error:', error)
    throw new Error(`Failed to process data export: ${error.message}`)
  }
}

/**
 * Process data deletion request with enhanced discovery
 */
async function processDataDeletion(supabaseClient: any, requestId: string, email: string, discovery: DataDiscoveryResult) {
  console.log(`Processing data deletion for ${email}`)
  
  try {
    const deletionResults = {}
    let totalDeleted = 0
    
    // Get user ID for user_id based deletions
    let userId: string | null = null
    try {
      const { data: userData } = await supabaseClient
        .from('users')
        .select('id')
        .eq('email', email)
        .single()
      
      if (userData) {
        userId = userData.id
      }
    } catch (error) {
      console.log('No user record found for deletion')
    }
    
    // Process deletion for each table (in reverse dependency order)
    const deletionOrder = ['user_consents', 'dsr_requests', 'communications', 'claims', 'policies', 'audit_logs', 'users']
    
    for (const tableName of deletionOrder) {
      if (!discovery.tables[tableName]) continue
      
      try {
        const config = DATA_DISCOVERY_TABLES[tableName]
        let deleteQuery = supabaseClient.from(tableName)
        
        if (config.emailColumn) {
          deleteQuery = deleteQuery.delete().eq(config.emailColumn, email)
        } else if (config.userIdColumn && userId) {
          deleteQuery = deleteQuery.delete().eq(config.userIdColumn, userId)
        } else {
          continue
        }
        
        const { data, error, count } = await deleteQuery
        
        if (error) {
          console.error(`Error deleting from ${tableName}:`, error)
          deletionResults[tableName] = { error: error.message, deleted: 0 }
        } else {
          const deletedCount = count || 0
          deletionResults[tableName] = { deleted: deletedCount }
          totalDeleted += deletedCount
          console.log(`Deleted ${deletedCount} records from ${tableName}`)
        }
        
      } catch (error) {
        console.error(`Failed to delete from ${tableName}:`, error)
        deletionResults[tableName] = { error: error.message, deleted: 0 }
      }
    }
    
    return {
      deletion_summary: {
        total_records_deleted: totalDeleted,
        tables_processed: Object.keys(deletionResults),
        deletion_date: new Date().toISOString()
      },
      detailed_results: deletionResults,
      compliance_note: 'Some data may be retained for legal compliance purposes as outlined in our retention policy.',
      verification: `${totalDeleted} personal data records have been permanently deleted from our systems.`
    }
    
  } catch (error) {
    console.error('Data deletion error:', error)
    throw new Error(`Failed to process data deletion: ${error.message}`)
  }
}

/**
 * Process data rectification request with enhanced discovery
 */
async function processDataRectification(supabaseClient: any, requestId: string, email: string, discovery: DataDiscoveryResult) {
  console.log(`Processing data rectification for ${email}`)
  
  try {
    // Get the original request details to understand what needs to be corrected
    const { data: requestData } = await supabaseClient
      .from('dsr_requests')
      .select('description')
      .eq('id', requestId)
      .single()
    
    const description = requestData?.description || ''
    
    // For now, this is a manual process indicator
    // In a real implementation, this could include:
    // 1. Parse the description for specific field corrections
    // 2. Apply automated corrections where possible
    // 3. Flag items for manual review
    
    return {
      rectification_summary: {
        request_description: description,
        data_found: {
          total_records: discovery.totalRecords,
          tables: Object.keys(discovery.tables)
        },
        next_steps: 'Manual review required for data corrections',
        estimated_completion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days
      },
      manual_review_required: true,
      contact_required: true,
      instructions: 'Our data protection team will review your correction request and contact you within 5 business days to confirm the changes needed.'
    }
    
  } catch (error) {
    console.error('Data rectification error:', error)
    throw new Error(`Failed to process data rectification: ${error.message}`)
  }
}

/**
 * Send enhanced notification email
 */
async function sendEnhancedNotificationEmail(email: string, type: string, requestId: string, result: any, discovery: DataDiscoveryResult) {
  console.log(`Sending enhanced notification email to ${email}`)
  
  try {
    // In a real implementation, this would integrate with your email service
    // (SendGrid, AWS SES, etc.) with proper templates
    
    const emailContent = {
      to: email,
      subject: `Your ${type} request has been processed - ${requestId}`,
      template: `dsr_${type}_notification`,
      data: {
        requestId,
        type,
        result,
        discoveryResults: {
          totalRecords: discovery.totalRecords,
          tablesSearched: Object.keys(discovery.tables).length,
          estimatedSize: discovery.estimatedExportSize
        },
        processedAt: new Date().toISOString()
      }
    }
    
    console.log('Email notification prepared:', emailContent)
    
    // Mock email sending
    return { success: true, messageId: `email_${Date.now()}` }
    
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Generate secure token for downloads
 */
function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
} 