# Configure the Google Cloud Provider
terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  
  # Optional: Store state in Google Cloud Storage
  # backend "gcs" {
  #   bucket = "rlp-terraform-state"
  #   prefix = "terraform/state"
  # }
}

# Configure the Google Provider
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "appengine.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "compute.googleapis.com",
    "sql-component.googleapis.com",
    "sqladmin.googleapis.com",
    "storage-component.googleapis.com",
    "storage.googleapis.com",
    "iam.googleapis.com"
  ])
  
  service = each.value
  disable_on_destroy = false
}

# Create App Engine application
resource "google_app_engine_application" "app" {
  location_id = var.region
  depends_on  = [google_project_service.required_apis]
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

# Create Cloud SQL instance (PostgreSQL)
resource "google_sql_database_instance" "main" {
  name             = "rlp-database"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"  # Smallest instance for development
    
    backup_configuration {
      enabled    = true
      start_time = "02:00"
    }
    
    ip_configuration {
      ipv4_enabled    = true
      require_ssl     = false  # For development
      authorized_networks {
        name  = "all"
        value = "0.0.0.0/0"
      }
    }
  }

  deletion_protection = false  # For development
  depends_on = [google_project_service.required_apis]
}

# Create database
resource "google_sql_database" "database" {
  name     = "rlp_db"
  instance = google_sql_database_instance.main.name
}

# Create database user
resource "google_sql_user" "users" {
  name     = "rlp_user"
  instance = google_sql_database_instance.main.name
  password = var.db_password
}

# Output important values
output "app_engine_url" {
  value = "https://${google_app_engine_application.app.default_hostname}"
}

output "database_connection_name" {
  value = google_sql_database_instance.main.connection_name
}

output "database_instance_name" {
  value = google_sql_database_instance.main.name
}

output "static_bucket_name" {
  value = google_storage_bucket.static_assets.name
} 