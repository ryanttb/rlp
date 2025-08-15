terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "appengine.googleapis.com",
    "cloudbuild.googleapis.com",
    "storage.googleapis.com",
    "sqladmin.googleapis.com",
    "servicenetworking.googleapis.com"
  ])
  
  service = each.value
  disable_dependent_services = false
}

# Create Cloud Storage bucket for static assets
resource "google_storage_bucket" "static_assets" {
  name          = "${var.project_id}-static-assets"
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Create VPC network for Cloud SQL
resource "google_compute_network" "vpc" {
  name                    = "${var.project_id}-vpc"
  auto_create_subnetworks = false
  
  depends_on = [google_project_service.required_apis]
}

# Create subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "${var.project_id}-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

# Reserve IP range for private services access
resource "google_compute_global_address" "private_ip_range" {
  name          = "${var.project_id}-private-ip-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

# Create private connection
resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
  
  depends_on = [google_project_service.required_apis]
}

# Create Cloud SQL PostgreSQL instances for different environments
resource "google_sql_database_instance" "postgres_dev" {
  count            = var.enable_dev_instance ? 1 : 0
  name             = "${var.project_id}-postgres-dev"
  database_version = "POSTGRES_15"
  region           = var.region
  deletion_protection = false

  settings {
    tier = "db-f1-micro"
    
    ip_configuration {
      ipv4_enabled                                  = true  # Public IP for dev
      private_network                               = google_compute_network.vpc.id
      enable_private_path_for_google_cloud_services = true
      
      # Authorized networks for development
      dynamic "authorized_networks" {
        for_each = var.dev_authorized_networks
        content {
          name  = "dev-network-${index(var.dev_authorized_networks, authorized_networks.value)}"
          value = authorized_networks.value
        }
      }
    }
    
    backup_configuration {
      enabled = true
      start_time = "02:00"
      point_in_time_recovery_enabled = true
    }
    
    database_flags {
      name  = "log_statement"
      value = "all"
    }
  }

  depends_on = [google_service_networking_connection.private_vpc_connection]
}

resource "google_sql_database_instance" "postgres_prod" {
  count            = var.enable_prod_instance ? 1 : 0
  name             = "${var.project_id}-postgres-prod"
  database_version = "POSTGRES_15"
  region           = var.region
  deletion_protection = var.prod_deletion_protection

  settings {
    tier = var.prod_tier
    
    ip_configuration {
      ipv4_enabled                                  = false  # Private IP only for prod
      private_network                               = google_compute_network.vpc.id
      enable_private_path_for_google_cloud_services = true
    }
    
    backup_configuration {
      enabled = true
      start_time = "02:00"
      point_in_time_recovery_enabled = true
      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }
    }
    
    database_flags {
      name  = "log_statement"
      value = "all"
    }
  }

  depends_on = [google_service_networking_connection.private_vpc_connection]
}

# Create databases for each environment
resource "google_sql_database" "database_dev" {
  count    = var.enable_dev_instance ? 1 : 0
  name     = "rlp_database"
  instance = google_sql_database_instance.postgres_dev[0].name
}

resource "google_sql_database" "database_prod" {
  count    = var.enable_prod_instance ? 1 : 0
  name     = "rlp_database"
  instance = google_sql_database_instance.postgres_prod[0].name
}

# Create database users for each environment
resource "google_sql_user" "app_user_dev" {
  count    = var.enable_dev_instance ? 1 : 0
  name     = "rlp_user"
  instance = google_sql_database_instance.postgres_dev[0].name
  password = var.db_password
}

resource "google_sql_user" "app_user_prod" {
  count    = var.enable_prod_instance ? 1 : 0
  name     = "rlp_user"
  instance = google_sql_database_instance.postgres_prod[0].name
  password = var.db_password
}

# App Engine application
resource "google_app_engine_application" "app" {
  project     = var.project_id
  location_id = var.region

  depends_on = [google_project_service.required_apis]
}

# Outputs
output "storage_bucket" {
  value = google_storage_bucket.static_assets.name
}

output "app_engine_url" {
  value = "https://${google_app_engine_application.app.default_hostname}"
}

# Development database outputs
output "database_dev_connection_name" {
  value = var.enable_dev_instance ? google_sql_database_instance.postgres_dev[0].connection_name : null
  description = "The connection name for the development Cloud SQL instance"
}

output "database_dev_public_ip" {
  value = var.enable_dev_instance ? google_sql_database_instance.postgres_dev[0].public_ip_address : null
  description = "The public IP address of the development Cloud SQL instance"
}

output "database_dev_url" {
  value = var.enable_dev_instance ? (
    "postgresql://${google_sql_user.app_user_dev[0].name}:${var.db_password}@${google_sql_database_instance.postgres_dev[0].public_ip_address}:5432/${google_sql_database.database_dev[0].name}"
  ) : null
  description = "Database URL for development environment"
  sensitive = true
}

# Production database outputs
output "database_prod_connection_name" {
  value = var.enable_prod_instance ? google_sql_database_instance.postgres_prod[0].connection_name : null
  description = "The connection name for the production Cloud SQL instance"
}

output "database_prod_private_ip" {
  value = var.enable_prod_instance ? google_sql_database_instance.postgres_prod[0].private_ip_address : null
  description = "The private IP address of the production Cloud SQL instance"
}

output "database_prod_url" {
  value = var.enable_prod_instance ? (
    "postgresql://${google_sql_user.app_user_prod[0].name}:${var.db_password}@${google_sql_database_instance.postgres_prod[0].private_ip_address}:5432/${google_sql_database.database_prod[0].name}"
  ) : null
  description = "Database URL for production environment"
  sensitive = true
} 