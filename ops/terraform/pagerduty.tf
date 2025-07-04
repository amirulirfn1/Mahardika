# =============================================================================
# PagerDuty Integration for Mahardika Platform
# Incident Response and Alerting Configuration
# =============================================================================

terraform {
  required_providers {
    pagerduty = {
      source  = "PagerDuty/pagerduty"
      version = "~> 3.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# =============================================================================
# Variables
# =============================================================================

variable "pagerduty_token" {
  description = "PagerDuty API token"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "escalation_policy_name" {
  description = "Name of the escalation policy"
  type        = string
  default     = "Mahardika Security Incidents"
}

variable "team_email" {
  description = "Primary team email for notifications"
  type        = string
  default     = "security@mahardika.com"
}

variable "webhook_endpoint" {
  description = "Webhook endpoint URL for incident processing"
  type        = string
  default     = "https://api.mahardika.com/webhooks/pagerduty"
}

# =============================================================================
# Data Sources
# =============================================================================

# Get existing team or create if needed
data "pagerduty_team" "security_team" {
  name = "Security Team"
}

# =============================================================================
# PagerDuty Configuration
# =============================================================================

# Escalation Policy for Security Incidents
resource "pagerduty_escalation_policy" "security_incidents" {
  name        = var.escalation_policy_name
  description = "Escalation policy for security incidents and data breaches"
  
  rule {
    escalation_delay_in_minutes = 5
    
    target {
      type = "user_reference"
      id   = pagerduty_user.security_lead.id
    }
  }
  
  rule {
    escalation_delay_in_minutes = 15
    
    target {
      type = "user_reference"
      id   = pagerduty_user.security_manager.id
    }
  }
  
  rule {
    escalation_delay_in_minutes = 30
    
    target {
      type = "user_reference"
      id   = pagerduty_user.ciso.id
    }
  }

  teams = [data.pagerduty_team.security_team.id]
}

# Users for Escalation
resource "pagerduty_user" "security_lead" {
  name  = "Security Lead"
  email = "security-lead@mahardika.com"
  role  = "user"
}

resource "pagerduty_user" "security_manager" {
  name  = "Security Manager"  
  email = "security-manager@mahardika.com"
  role  = "user"
}

resource "pagerduty_user" "ciso" {
  name  = "Chief Information Security Officer"
  email = "ciso@mahardika.com"
  role  = "admin"
}

# Service for Security Incidents
resource "pagerduty_service" "security_incidents" {
  name                    = "Mahardika Security Incidents"
  description            = "Service for handling security incidents, data breaches, and compliance issues"
  auto_resolve_timeout   = 86400  # 24 hours
  acknowledgement_timeout = 1800   # 30 minutes
  escalation_policy      = pagerduty_escalation_policy.security_incidents.id
  
  incident_urgency_rule {
    type    = "constant"
    urgency = "high"
  }

  auto_pause_notifications_parameters {
    enabled = true
    timeout = 300  # 5 minutes
  }
}

# Integration for API-based alerts
resource "pagerduty_service_integration" "security_api" {
  name    = "Security Incidents API"
  service = pagerduty_service.security_incidents.id
  vendor  = data.pagerduty_vendor.events_api_v2.id
}

# Data source for Events API v2
data "pagerduty_vendor" "events_api_v2" {
  name = "Events API V2"
}

# Event Rules for Auto-Classification
resource "pagerduty_event_orchestration" "security_orchestration" {
  name = "Mahardika Security Event Orchestration"
  description = "Orchestration for security events with automatic classification and routing"
  
  team = data.pagerduty_team.security_team.id
}

resource "pagerduty_event_orchestration_router" "security_router" {
  event_orchestration = pagerduty_event_orchestration.security_orchestration.id
  
  set {
    id = "security_routing"
    
    rule {
      label = "Data Breach - Critical"
      condition {
        expression = "event.custom_details.incident_type matches 'data_breach'"
      }
      actions {
        route_to = pagerduty_event_orchestration_service.critical_incidents.id
        priority = "P53ZZH5"  # Critical priority
        severity = "critical"
      }
    }
    
    rule {
      label = "System Compromise - High"
      condition {
        expression = "event.custom_details.incident_type matches 'system_compromise'"
      }
      actions {
        route_to = pagerduty_event_orchestration_service.high_incidents.id
        priority = "P53ZZH6"  # High priority
        severity = "error"
      }
    }
    
    rule {
      label = "Security Alert - Medium"
      condition {
        expression = "event.custom_details.incident_type matches 'security_alert'"
      }
      actions {
        route_to = pagerduty_event_orchestration_service.medium_incidents.id
        priority = "P53ZZH7"  # Medium priority
        severity = "warning"
      }
    }
    
    # Catch-all rule
    rule {
      label = "Default Security Routing"
      actions {
        route_to = pagerduty_event_orchestration_service.default_incidents.id
        priority = "P53ZZH7"  # Medium priority
        severity = "info"
      }
    }
  }
}

# Service Orchestrations for Different Priorities
resource "pagerduty_event_orchestration_service" "critical_incidents" {
  service = pagerduty_service.security_incidents.id
  
  set {
    id = "critical_processing"
    
    rule {
      label = "Critical Security Incident"
      condition {
        expression = "event.severity matches 'critical'"
      }
      actions {
        priority = "P53ZZH5"  # Critical
        severity = "critical"
        escalation_policy = pagerduty_escalation_policy.security_incidents.id
        
        # Immediately create high-priority incident
        suppress = false
        
        # Add custom fields for incident tracking
        variable {
          name = "incident_id"
          path = "event.custom_details.incident_id"
          type = "regex"
          value = ".*"
        }
        
        variable {
          name = "affected_users"
          path = "event.custom_details.affected_users"
          type = "regex"
          value = ".*"
        }
      }
    }
  }
}

resource "pagerduty_event_orchestration_service" "high_incidents" {
  service = pagerduty_service.security_incidents.id
  
  set {
    id = "high_processing"
    
    rule {
      label = "High Priority Security Incident"
      condition {
        expression = "event.severity matches 'error'"
      }
      actions {
        priority = "P53ZZH6"  # High
        severity = "error"
        escalation_policy = pagerduty_escalation_policy.security_incidents.id
      }
    }
  }
}

resource "pagerduty_event_orchestration_service" "medium_incidents" {
  service = pagerduty_service.security_incidents.id
  
  set {
    id = "medium_processing"
    
    rule {
      label = "Medium Priority Security Alert"
      condition {
        expression = "event.severity matches 'warning'"
      }
      actions {
        priority = "P53ZZH7"  # Medium
        severity = "warning"
        escalation_policy = pagerduty_escalation_policy.security_incidents.id
        
        # Suppress similar incidents for 10 minutes
        suppress = true
        suppression_duration = 600
      }
    }
  }
}

resource "pagerduty_event_orchestration_service" "default_incidents" {
  service = pagerduty_service.security_incidents.id
  
  set {
    id = "default_processing"
    
    rule {
      label = "Default Security Processing"
      actions {
        priority = "P53ZZH7"  # Medium
        severity = "info"
        escalation_policy = pagerduty_escalation_policy.security_incidents.id
      }
    }
  }
}

# =============================================================================
# Webhook Configuration
# =============================================================================

# Webhook for incident status updates
resource "pagerduty_webhook_subscription" "incident_updates" {
  description    = "Webhook for incident status updates"
  delivery_method {
    type = "http_delivery_method"
    url  = var.webhook_endpoint
    custom_headers = {
      "X-Webhook-Source" = "pagerduty"
      "X-Environment"    = var.environment
    }
  }
  
  events = [
    "incident.acknowledged",
    "incident.annotated", 
    "incident.delegated",
    "incident.escalated",
    "incident.reassigned",
    "incident.reopened",
    "incident.resolved",
    "incident.status_update_published",
    "incident.triggered",
    "incident.unacknowledged"
  ]
  
  filter {
    type = "service_reference"
    id   = pagerduty_service.security_incidents.id
  }
}

# =============================================================================
# AWS Lambda for Webhook Processing
# =============================================================================

# IAM role for Lambda
resource "aws_iam_role" "pagerduty_webhook_lambda" {
  name = "pagerduty-webhook-lambda-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for Lambda execution
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.pagerduty_webhook_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda function for processing PagerDuty webhooks
resource "aws_lambda_function" "pagerduty_webhook_processor" {
  filename         = "pagerduty_webhook.zip"
  function_name    = "pagerduty-webhook-processor"
  role            = aws_iam_role.pagerduty_webhook_lambda.arn
  handler         = "index.handler"
  runtime         = "python3.9"
  timeout         = 30
  
  environment {
    variables = {
      ENVIRONMENT = var.environment
      SUPABASE_URL = data.aws_ssm_parameter.supabase_url.value
      SUPABASE_KEY = data.aws_ssm_parameter.supabase_key.value
    }
  }
}

# API Gateway for webhook endpoint
resource "aws_api_gateway_rest_api" "pagerduty_webhook" {
  name        = "pagerduty-webhook-api"
  description = "API Gateway for PagerDuty webhook processing"
  
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "webhook" {
  rest_api_id = aws_api_gateway_rest_api.pagerduty_webhook.id
  parent_id   = aws_api_gateway_rest_api.pagerduty_webhook.root_resource_id
  path_part   = "webhook"
}

resource "aws_api_gateway_method" "webhook_post" {
  rest_api_id   = aws_api_gateway_rest_api.pagerduty_webhook.id
  resource_id   = aws_api_gateway_resource.webhook.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "webhook_lambda" {
  rest_api_id = aws_api_gateway_rest_api.pagerduty_webhook.id
  resource_id = aws_api_gateway_resource.webhook.id
  http_method = aws_api_gateway_method.webhook_post.http_method
  
  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.pagerduty_webhook_processor.invoke_arn
}

resource "aws_lambda_permission" "api_gateway_invoke" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pagerduty_webhook_processor.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.pagerduty_webhook.execution_arn}/*/*"
}

# =============================================================================
# Data Sources for Secrets
# =============================================================================

data "aws_ssm_parameter" "supabase_url" {
  name = "/mahardika/${var.environment}/supabase_url"
}

data "aws_ssm_parameter" "supabase_key" {
  name = "/mahardika/${var.environment}/supabase_key"
}

# =============================================================================
# Outputs
# =============================================================================

output "pagerduty_service_id" {
  description = "PagerDuty service ID for security incidents"
  value       = pagerduty_service.security_incidents.id
}

output "pagerduty_integration_key" {
  description = "Integration key for sending alerts to PagerDuty"
  value       = pagerduty_service_integration.security_api.integration_key
  sensitive   = true
}

output "webhook_url" {
  description = "Webhook URL for PagerDuty incident updates"
  value       = "${aws_api_gateway_rest_api.pagerduty_webhook.execution_arn}/webhook"
}

output "escalation_policy_id" {
  description = "Escalation policy ID for security incidents"
  value       = pagerduty_escalation_policy.security_incidents.id
}

# =============================================================================
# Monitoring and Alerting Rules
# =============================================================================

# CloudWatch Log Group for webhook processing
resource "aws_cloudwatch_log_group" "pagerduty_webhook_logs" {
  name              = "/aws/lambda/pagerduty-webhook-processor"
  retention_in_days = 30
}

# CloudWatch Alarm for webhook failures
resource "aws_cloudwatch_metric_alarm" "webhook_errors" {
  alarm_name          = "pagerduty-webhook-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "60"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "This metric monitors lambda errors for PagerDuty webhook processing"
  
  dimensions = {
    FunctionName = aws_lambda_function.pagerduty_webhook_processor.function_name
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
}

# SNS Topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "pagerduty-webhook-alerts"
}

# =============================================================================
# Tags
# =============================================================================

locals {
  common_tags = {
    Environment = var.environment
    Project     = "Mahardika"
    Component   = "Security"
    ManagedBy   = "Terraform"
    Owner       = "Security Team"
  }
}

# Apply tags to all resources
resource "aws_lambda_function" "pagerduty_webhook_processor" {
  # ... existing configuration ...
  
  tags = local.common_tags
}

resource "aws_api_gateway_rest_api" "pagerduty_webhook" {
  # ... existing configuration ...
  
  tags = local.common_tags
} 