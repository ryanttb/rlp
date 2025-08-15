#!/bin/bash

# RLP GCP Deployment Script
# This script deploys the Next.js application to Google Cloud Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${PROJECT_ID:-"your-gcp-project-id"}
REGION=${REGION:-"us-central1"}
ZONE=${ZONE:-"us-central1-a"}

echo -e "${GREEN}🚀 Starting RLP GCP Deployment${NC}"

# Check if required tools are installed
check_requirements() {
    echo -e "${YELLOW}Checking requirements...${NC}"
    
    if ! command -v gcloud &> /dev/null; then
        echo -e "${RED}❌ Google Cloud SDK is not installed. Please install it first.${NC}"
        echo "Visit: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        echo -e "${RED}❌ Terraform is not installed. Please install it first.${NC}"
        echo "Visit: https://developer.hashicorp.com/terraform/downloads"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All requirements met${NC}"
}

# Authenticate with Google Cloud
authenticate_gcp() {
    echo -e "${YELLOW}Authenticating with Google Cloud...${NC}"
    gcloud auth login
    gcloud config set project $PROJECT_ID
    gcloud config set compute/region $REGION
    gcloud config set compute/zone $ZONE
    echo -e "${GREEN}✅ GCP authentication complete${NC}"
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    echo -e "${YELLOW}Deploying infrastructure with Terraform...${NC}"
    
    cd terraform
    
    # Initialize Terraform
    terraform init
    
    # Plan the deployment
    terraform plan -var="project_id=$PROJECT_ID" -var="region=$REGION" -var="zone=$ZONE"
    
    # Apply the configuration
    echo -e "${YELLOW}Applying Terraform configuration...${NC}"
    terraform apply -var="project_id=$PROJECT_ID" -var="region=$REGION" -var="zone=$ZONE" -auto-approve
    
    # Get outputs
    APP_URL=$(terraform output -raw app_engine_url)
    DB_INSTANCE=$(terraform output -raw database_instance_name)
    BUCKET_NAME=$(terraform output -raw static_bucket_name)
    
    cd ..
    
    echo -e "${GREEN}✅ Infrastructure deployed successfully${NC}"
    echo -e "${GREEN}App Engine URL: $APP_URL${NC}"
    echo -e "${GREEN}Database Instance: $DB_INSTANCE${NC}"
    echo -e "${GREEN}Storage Bucket: $BUCKET_NAME${NC}"
}

# Setup database
setup_database() {
    echo -e "${YELLOW}Setting up database...${NC}"
    
    # Generate Prisma client
    npx prisma generate
    
    # Run database migrations
    npx prisma db push
    
    echo -e "${GREEN}✅ Database setup complete${NC}"
}

# Setup environment-specific database
setup_environment_database() {
    local environment=$1
    
    echo -e "${YELLOW}Setting up ${environment} database...${NC}"
    
    # Get the appropriate database URL from Terraform outputs
    if [ "$environment" = "dev" ]; then
        DATABASE_URL=$(cd terraform && terraform output -raw database_dev_url 2>/dev/null || echo "")
        if [ -z "$DATABASE_URL" ]; then
            echo -e "${RED}❌ Development database URL not found. Make sure enable_dev_instance = true in terraform.tfvars${NC}"
            return 1
        fi
    elif [ "$environment" = "prod" ]; then
        DATABASE_URL=$(cd terraform && terraform output -raw database_prod_url 2>/dev/null || echo "")
        if [ -z "$DATABASE_URL" ]; then
            echo -e "${RED}❌ Production database URL not found. Make sure enable_prod_instance = true in terraform.tfvars${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Unknown environment: $environment${NC}"
        return 1
    fi
    
    # Export the database URL for Prisma
    export DATABASE_URL
    
    # Generate Prisma client
    npx prisma generate
    
    # Run database migrations
    npx prisma db push
    
    echo -e "${GREEN}✅ ${environment} database setup complete${NC}"
}

# Build and deploy application
deploy_application() {
    echo -e "${YELLOW}Building and deploying application...${NC}"
    
    # Install dependencies
    npm ci
    
    # Build the application
    npm run build
    
    # Deploy to App Engine
    gcloud app deploy app.yaml --quiet
    
    echo -e "${GREEN}✅ Application deployed successfully${NC}"
}

# Main deployment flow
main() {
    local environment=${1:-"dev"}
    
    check_requirements
    authenticate_gcp
    deploy_infrastructure
    setup_environment_database "$environment"
    deploy_application
    
    echo -e "${GREEN}🎉 ${environment} deployment completed successfully!${NC}"
    echo -e "${GREEN}Your application is now running on Google Cloud Platform${NC}"
}

# Run main function
main "$@" 