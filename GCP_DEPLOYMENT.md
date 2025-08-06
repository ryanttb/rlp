# Google Cloud Platform Deployment Guide

This guide will walk you through deploying your Rapid Liquid Printing (RLP) Next.js application to Google Cloud Platform using Terraform for infrastructure management.

## 🎯 What You'll Learn

- **Terraform Infrastructure as Code**: Define and manage cloud resources
- **Google Cloud Platform Services**: App Engine, Cloud SQL, Cloud Storage
- **CI/CD Pipeline**: Automated deployment with Cloud Build
- **Database Migration**: From Firebase to PostgreSQL
- **Production-Ready Setup**: Scalable architecture

## 📋 Prerequisites

### 1. Install Required Tools

```bash
# Google Cloud SDK
# Visit: https://cloud.google.com/sdk/docs/install
gcloud init

# Terraform
# Visit: https://developer.hashicorp.com/terraform/downloads
terraform --version

# Node.js (if not already installed)
node --version
npm --version
```

### 2. Google Cloud Project Setup

1. Create a new Google Cloud Project or use an existing one
2. Enable billing for the project
3. Note your Project ID (you'll need this later)

### 3. Authentication

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Verify authentication
gcloud auth list
```

## 🚀 Quick Start Deployment

### Step 1: Configure Variables

```bash
# Copy the example variables file
cp terraform/terraform.tfvars.example terraform/terraform.tfvars

# Edit the file with your values
nano terraform/terraform.tfvars
```

Fill in your values:
```hcl
project_id   = "your-gcp-project-id"
region       = "us-central1"
zone         = "us-central1-a"
db_password  = "your-secure-database-password"
environment  = "dev"
```

### Step 2: Run Deployment Script

```bash
# Make the script executable
chmod +x scripts/deploy.sh

# Run the deployment
./scripts/deploy.sh
```

## 🏗️ Infrastructure Overview

### What Gets Created

1. **App Engine Application**: Hosts your Next.js app
2. **Cloud SQL (PostgreSQL)**: Database for your application
3. **Cloud Storage Bucket**: File storage for 3D models and assets
4. **Cloud Build**: CI/CD pipeline for automated deployments

### Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Cloud SQL     │    │  Cloud Storage  │
│   (App Engine)  │◄──►│  (PostgreSQL)   │    │   (Files)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Cloud Build   │
│   (CI/CD)       │
└─────────────────┘
```

## 📊 Database Migration

### From Firebase to PostgreSQL

Your application currently uses Firebase Firestore. The new setup uses PostgreSQL with Prisma ORM:

1. **Schema Migration**: The Prisma schema (`prisma/schema.prisma`) defines your data models
2. **Data Migration**: You can export data from Firebase and import to PostgreSQL
3. **Code Updates**: Replace Firebase calls with Prisma queries

### Example: Model Operations

**Before (Firebase):**
```typescript
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Create a model
const docRef = await addDoc(collection(db, "models"), {
  name: "My Model",
  description: "A 3D model",
  fileUrl: "https://...",
  userId: "user123"
});

// Get all models
const querySnapshot = await getDocs(collection(db, "models"));
```

**After (Prisma):**
```typescript
import { prisma } from './database';

// Create a model
const model = await prisma.model.create({
  data: {
    name: "My Model",
    description: "A 3D model",
    fileUrl: "https://...",
    userId: "user123"
  }
});

// Get all models
const models = await prisma.model.findMany({
  include: {
    user: true
  }
});
```

## 🔧 Manual Deployment Steps

If you prefer to deploy manually instead of using the script:

### 1. Deploy Infrastructure

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -var="project_id=YOUR_PROJECT_ID" -var="region=us-central1" -var="zone=us-central1-a"

# Apply the configuration
terraform apply -var="project_id=YOUR_PROJECT_ID" -var="region=us-central1" -var="zone=us-central1-a"
```

### 2. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed database with initial data
npx prisma db seed
```

### 3. Deploy Application

```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Deploy to App Engine
gcloud app deploy app.yaml
```

## 🔄 CI/CD Pipeline

### Cloud Build Configuration

The `cloudbuild.yaml` file defines your CI/CD pipeline:

1. **Install Dependencies**: `npm ci`
2. **Lint Code**: `npm run lint`
3. **Build Application**: `npm run build`
4. **Deploy to App Engine**: `gcloud app deploy`

### Trigger Setup

1. Connect your GitHub repository to Cloud Build
2. Set up triggers for automatic deployment on push to main branch
3. Configure environment variables in Cloud Build

## 🔐 Security Best Practices

### Environment Variables

Store sensitive data as environment variables:

```bash
# In App Engine
gcloud app deploy app.yaml --set-env-vars DATABASE_URL="postgresql://..."

# Or in app.yaml
env_variables:
  DATABASE_URL: "postgresql://..."
```

### Database Security

1. Use Cloud SQL Proxy for secure connections
2. Enable SSL for database connections
3. Restrict IP access to database
4. Use strong passwords and rotate regularly

### Storage Security

1. Use signed URLs for file access
2. Implement proper CORS policies
3. Set up bucket-level permissions
4. Enable audit logging

## 📈 Monitoring & Scaling

### App Engine Scaling

The `app.yaml` configuration includes automatic scaling:

```yaml
automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10
```

### Database Scaling

- Start with `db-f1-micro` for development
- Scale to `db-n1-standard-1` for production
- Consider read replicas for high traffic

### Monitoring

1. **Cloud Monitoring**: Set up alerts for errors and performance
2. **Cloud Logging**: Centralized logging for debugging
3. **Error Reporting**: Automatic error tracking

## 💰 Cost Optimization

### Development vs Production

**Development:**
- App Engine: F1 instance (free tier)
- Cloud SQL: db-f1-micro (~$7/month)
- Cloud Storage: Minimal usage

**Production:**
- App Engine: F2 or F4 instances
- Cloud SQL: db-n1-standard-1 (~$25/month)
- Cloud Storage: Based on usage

### Cost Monitoring

1. Set up billing alerts
2. Monitor resource usage
3. Use Cloud Billing reports
4. Implement cost controls

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Database Connection Issues**
   ```bash
   # Check database status
   gcloud sql instances describe rlp-database
   
   # Connect to database
   gcloud sql connect rlp-database --user=rlp_user
   ```

3. **App Engine Deployment Failures**
   ```bash
   # Check logs
   gcloud app logs tail -s default
   
   # Check app status
   gcloud app describe
   ```

### Useful Commands

```bash
# List all resources
terraform state list

# Destroy infrastructure
terraform destroy

# View App Engine logs
gcloud app logs tail

# Connect to database
gcloud sql connect rlp-database --user=rlp_user

# Check storage bucket
gsutil ls gs://YOUR_PROJECT_ID-static-assets
```

## 📚 Additional Resources

- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Terraform Documentation](https://www.terraform.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)

## 🎉 Next Steps

1. **Customize the Infrastructure**: Modify Terraform files for your specific needs
2. **Set up Monitoring**: Configure alerts and logging
3. **Implement CI/CD**: Connect your repository to Cloud Build
4. **Optimize Performance**: Tune database queries and caching
5. **Security Hardening**: Implement additional security measures

This setup gives you a production-ready, scalable architecture that demonstrates your ability to work with modern cloud technologies and infrastructure as code! 