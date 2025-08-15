variable "project_id" {
  description = "The ID of the Google Cloud project"
  type        = string
}

variable "region" {
  description = "The region to deploy resources to"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The zone to deploy resources to"
  type        = string
  default     = "us-central1-a"
}

variable "db_password" {
  description = "Password for the database user"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Development instance configuration
variable "enable_dev_instance" {
  description = "Enable development database instance"
  type        = bool
  default     = true
}

variable "dev_authorized_networks" {
  description = "List of authorized networks for development Cloud SQL (CIDR notation)"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # WARNING: This allows all IPs - restrict for production
}

# Production instance configuration
variable "enable_prod_instance" {
  description = "Enable production database instance"
  type        = bool
  default     = false
}

variable "prod_tier" {
  description = "Machine type for production Cloud SQL instance"
  type        = string
  default     = "db-f1-micro"
}

variable "prod_deletion_protection" {
  description = "Enable deletion protection for production database"
  type        = bool
  default     = true
}

# Legacy variables (deprecated - kept for backward compatibility)
variable "enable_public_ip" {
  description = "DEPRECATED: Use enable_dev_instance instead"
  type        = bool
  default     = true
}

variable "authorized_networks" {
  description = "DEPRECATED: Use dev_authorized_networks instead"
  type        = list(string)
  default     = ["0.0.0.0/0"]
} 