# RLP GCP App Engine Deployment Guide

This guide will help you deploy the RLP (Rapid Liquid Printing) application to Google Cloud Platform using App Engine.

## Prerequisites

- Google Cloud Platform account
- gcloud CLI installed and authenticated
- Terraform installed
- Node.js and npm installed

## Setup Instructions

### 1. Install Required Tools

The following tools should already be installed on your system:

```bash
# Verify installations
gcloud --version
terraform --version
node --version
npm --version
```

### 2. Create a GCP Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 3. Enable Billing

Ensure billing is enabled for your GCP project.

### 4. Configure Terraform Variables

1. Copy the example variables file:
   ```bash
   cp terraform/terraform.tfvars.example terraform/terraform.tfvars
   ```

2. Edit `terraform/terraform.tfvars` and update with your values:
   ```hcl
   project_id = "your-actual-project-id"
   region     = "us-central1"
   zone       = "us-central1-a"
   ```

### 5. Set Environment Variables

```bash
export GOOGLE_CLOUD_PROJECT="your-project-id"
```

### 6. Authenticate with GCP

```bash
gcloud auth login
gcloud config set project $GOOGLE_CLOUD_PROJECT
```

## Deployment

### Option 1: Automated Deployment (Recommended)

Run the deployment script:

```bash
./deploy.sh
```

This script will:
- Build the application
- Set up infrastructure with Terraform
- Deploy to App Engine
- Provide you with the deployment URL

### Option 2: Manual Deployment

#### Step 1: Build the Application

```bash
npm run build
```

#### Step 2: Deploy Infrastructure

```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
cd ..
```

#### Step 3: Update Configuration

Update `app.yaml` with your project values:

```yaml
env_variables:
  GOOGLE_CLOUD_PROJECT: "your-project-id"
  CLOUD_STORAGE_BUCKET: "your-storage-bucket"
```

#### Step 4: Deploy to App Engine

```bash
gcloud app deploy app.yaml
```

## Infrastructure Components

The Terraform configuration creates:

- **App Engine Application**: Hosts your Next.js application
- **Cloud Storage Bucket**: Stores static assets and 3D model files
- **Firestore Database**: NoSQL database for application data
- **Required APIs**: Enables necessary Google Cloud services

## Environment Variables

The following environment variables are automatically configured:

- `NODE_ENV`: Set to "production"
- `GOOGLE_CLOUD_PROJECT`: Your GCP project ID
- `CLOUD_STORAGE_BUCKET`: Storage bucket for assets

## Post-Deployment

### Access Your Application

After deployment, your application will be available at:
```
https://your-project-id.uc.r.appspot.com
```

### Monitor Your Application

- View logs: `gcloud app logs tail -s default`
- Open in browser: `gcloud app browse`
- Check status: `gcloud app describe`

### Scaling

The application is configured with automatic scaling:
- Minimum instances: 1
- Maximum instances: 10
- Target CPU utilization: 65%

## Troubleshooting

### Common Issues

1. **Authentication Error**: Run `gcloud auth login`
2. **Project Not Set**: Set `GOOGLE_CLOUD_PROJECT` environment variable
3. **API Not Enabled**: Terraform will automatically enable required APIs
4. **Build Failures**: Check that all dependencies are installed with `npm install`

### Useful Commands

```bash
# View application logs
gcloud app logs tail

# Check application status
gcloud app describe

# List versions
gcloud app versions list

# Rollback to previous version
gcloud app versions list
gcloud app services set-traffic default --splits=VERSION_ID=1
```

## Cleanup

To destroy the infrastructure:

```bash
cd terraform
terraform destroy
cd ..
```

**Warning**: This will delete all resources including data in Firestore and files in Cloud Storage.

## Security Considerations

- The application uses HTTPS by default
- Firestore security rules should be configured
- Cloud Storage bucket has CORS configured for file uploads
- Consider setting up proper IAM roles and permissions

## Cost Optimization

- The application uses F1 instance class (smallest available)
- Automatic scaling helps manage costs
- Consider setting up billing alerts
- Monitor usage in the Google Cloud Console 