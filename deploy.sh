#!/bin/bash

# RLP GCP App Engine Deployment Script
set -e

echo "🚀 Starting RLP deployment to GCP App Engine..."

# Check if required tools are installed
command -v gcloud >/dev/null 2>&1 || { echo "❌ gcloud is required but not installed. Aborting." >&2; exit 1; }
command -v terraform >/dev/null 2>&1 || { echo "❌ terraform is required but not installed. Aborting." >&2; exit 1; }

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please authenticate with gcloud:"
    gcloud auth login
fi

# Set default project if not specified
export GOOGLE_CLOUD_PROJECT=${GOOGLE_CLOUD_PROJECT:-"rlp-online"}
echo "📋 Using GCP project: $GOOGLE_CLOUD_PROJECT"

echo "📦 Building the application..."
npm run build

echo "🏗️  Setting up infrastructure with Terraform..."
cd terraform

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    echo "❌ terraform.tfvars not found. Please copy terraform.tfvars.example and update with your values."
    exit 1
fi

# Initialize and apply Terraform
terraform init
terraform plan
terraform apply -auto-approve

# Get outputs
STORAGE_BUCKET=$(terraform output -raw storage_bucket)
APP_ENGINE_URL=$(terraform output -raw app_engine_url)

cd ..

echo "📝 Updating app.yaml with project values..."
# Update app.yaml with actual project values
sed -i "s/your-project-id/$GOOGLE_CLOUD_PROJECT/g" app.yaml
sed -i "s/your-storage-bucket/$STORAGE_BUCKET/g" app.yaml

echo "🚀 Deploying to App Engine..."
gcloud app deploy app.yaml --quiet

echo "✅ Deployment complete!"
echo "🌐 Your app is available at: $APP_ENGINE_URL"
echo "📦 Storage bucket: $STORAGE_BUCKET"

# Clean up
echo "🧹 Cleaning up..."
rm -rf .next 