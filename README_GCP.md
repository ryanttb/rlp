# 🚀 RLP GCP Deployment Guide

This guide will help you deploy your Rapid Liquid Printing (RLP) Next.js application to Google Cloud Platform using modern DevOps practices.

## 🎯 What You'll Learn

- **Infrastructure as Code** with Terraform
- **Google Cloud Platform** services (App Engine, Cloud SQL, Cloud Storage)
- **CI/CD Pipeline** with Cloud Build
- **Database Migration** from Firebase to PostgreSQL
- **Production-Ready Architecture**

## 📋 Prerequisites

### Required Tools

1. **Google Cloud SDK**
   ```bash
   # Download from: https://cloud.google.com/sdk/docs/install
   gcloud init
   ```

2. **Terraform**
   ```bash
   # Download from: https://developer.hashicorp.com/terraform/downloads
   terraform --version
   ```

3. **Node.js** (already installed)
   ```bash
   node --version
   npm --version
   ```

### Google Cloud Setup

1. **Create a Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable billing (required for Cloud SQL)

2. **Enable APIs**
   ```bash
   gcloud services enable appengine.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable sql-component.googleapis.com
   gcloud services enable storage.googleapis.com
   ```

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
# Install new dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### Step 2: Configure Variables

```bash
# Copy example variables
cp terraform/terraform.tfvars.example terraform/terraform.tfvars

# Edit with your values
nano terraform/terraform.tfvars
```

Fill in your values:
```hcl
project_id   = "your-gcp-project-id"
region       = "us-central1"
zone         = "us-central1-a"
db_password  = "your-secure-password"
environment  = "dev"
```

### Step 3: Deploy

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

## 🏗️ Architecture Overview

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

### Services Used

- **App Engine**: Hosts your Next.js application
- **Cloud SQL (PostgreSQL)**: Relational database
- **Cloud Storage**: File storage for 3D models
- **Cloud Build**: Automated CI/CD pipeline

## 📊 Database Migration

### From Firebase to PostgreSQL

Your app currently uses Firebase Firestore. The new setup uses PostgreSQL with Prisma ORM.

### Run Migration

```bash
# After setting up PostgreSQL database
npx ts-node scripts/migrate-firebase-to-postgres.ts
```

### Code Changes Required

**Before (Firebase):**
```typescript
import { collection, addDoc } from 'firebase/firestore';
const docRef = await addDoc(collection(db, "models"), modelData);
```

**After (Prisma):**
```typescript
import { prisma } from './database';
const model = await prisma.model.create({ data: modelData });
```

## 🔧 Manual Deployment

If you prefer step-by-step deployment:

### 1. Deploy Infrastructure

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var="project_id=YOUR_PROJECT_ID"

# Apply configuration
terraform apply -var="project_id=YOUR_PROJECT_ID"
```

### 2. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Run migration script
npx ts-node scripts/migrate-firebase-to-postgres.ts
```

### 3. Deploy Application

```bash
# Install dependencies
npm ci

# Build application
npm run build

# Deploy to App Engine
gcloud app deploy app.yaml
```

## 🔄 CI/CD Pipeline

### Cloud Build Setup

1. **Connect Repository**
   - Go to Cloud Build > Triggers
   - Connect your GitHub repository

2. **Create Trigger**
   - Trigger on push to main branch
   - Use `cloudbuild.yaml` configuration

3. **Set Environment Variables**
   ```bash
   gcloud builds submit --config cloudbuild.yaml \
     --substitutions=_PROJECT_ID=YOUR_PROJECT_ID
   ```

### Automated Deployment

Every push to main branch will:
1. Install dependencies
2. Run linting
3. Build application
4. Deploy to App Engine

## 🔐 Security Configuration

### Environment Variables

```bash
# Set in App Engine
gcloud app deploy app.yaml --set-env-vars \
  DATABASE_URL="postgresql://..." \
  CLOUD_STORAGE_BUCKET="your-bucket-name"
```

### Database Security

- Use Cloud SQL Proxy for connections
- Enable SSL for database
- Restrict IP access
- Use strong passwords

### Storage Security

- Use signed URLs for file access
- Implement proper CORS policies
- Set bucket-level permissions

## 📈 Monitoring & Scaling

### App Engine Scaling

Configured in `app.yaml`:
```yaml
automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10
```

### Database Scaling

- **Development**: `db-f1-micro` (~$7/month)
- **Production**: `db-n1-standard-1` (~$25/month)

### Monitoring Setup

1. **Cloud Monitoring**: Set up alerts
2. **Cloud Logging**: Centralized logs
3. **Error Reporting**: Automatic error tracking

## 💰 Cost Optimization

### Development Costs

- **App Engine**: F1 instance (free tier)
- **Cloud SQL**: db-f1-micro (~$7/month)
- **Cloud Storage**: Minimal usage

### Production Costs

- **App Engine**: F2/F4 instances
- **Cloud SQL**: db-n1-standard-1 (~$25/month)
- **Cloud Storage**: Based on usage

### Cost Monitoring

```bash
# Set up billing alerts
gcloud billing budgets create --billing-account=YOUR_BILLING_ACCOUNT

# Monitor costs
gcloud billing accounts list
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Database Connection**
   ```bash
   # Check database status
   gcloud sql instances describe rlp-database
   
   # Connect to database
   gcloud sql connect rlp-database --user=rlp_user
   ```

3. **App Engine Issues**
   ```bash
   # Check logs
   gcloud app logs tail -s default
   
   # Check app status
   gcloud app describe
   ```

### Useful Commands

```bash
# List Terraform resources
terraform state list

# Destroy infrastructure
terraform destroy

# View App Engine logs
gcloud app logs tail

# Check storage bucket
gsutil ls gs://YOUR_PROJECT_ID-static-assets
```

## 📚 Learning Resources

### Terraform
- [Terraform Documentation](https://www.terraform.io/docs)
- [Google Cloud Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

### Google Cloud
- [App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Cloud Storage Documentation](https://cloud.google.com/storage/docs)

### Prisma
- [Prisma Documentation](https://www.prisma.io/docs)
- [Database Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## 🎉 Next Steps

1. **Customize Infrastructure**: Modify Terraform files for your needs
2. **Set up Monitoring**: Configure alerts and logging
3. **Implement CI/CD**: Connect repository to Cloud Build
4. **Optimize Performance**: Tune database queries and caching
5. **Security Hardening**: Implement additional security measures

## 📞 Support

If you encounter issues:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review [Google Cloud documentation](https://cloud.google.com/docs)
3. Check [Terraform documentation](https://www.terraform.io/docs)

This setup demonstrates your ability to work with:
- **Infrastructure as Code** (Terraform)
- **Cloud Platforms** (Google Cloud)
- **CI/CD Pipelines** (Cloud Build)
- **Database Management** (PostgreSQL, Prisma)
- **Production Deployment** (App Engine)

Perfect for showcasing your DevOps and cloud engineering skills! 🚀 