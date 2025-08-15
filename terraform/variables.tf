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

variable "enable_public_ip" {
  description = "Enable public IP access for Cloud SQL (not recommended for production)"
  type        = bool
  default     = true
}

variable "authorized_networks" {
  description = "List of authorized networks for Cloud SQL (CIDR notation)"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # WARNING: This allows all IPs - restrict for production
} 