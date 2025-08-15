# Multi-Environment Deployment Guide

This guide explains how to deploy your RLP application to multiple environments (development and production) with separate databases.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Development   │    │   Production    │
│   Environment   │    │   Environment   │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Dev Database   │    │  Prod Database  │
│  (Public IP)    │    │  (Private IP)   │
│  - Convenient   │    │  - Secure       │
│  - Accessible   │    │  - Isolated     │
└─────────────────┘    └─────────────────┘
```

## Terraform Configuration

### Variables

The Terraform configuration supports multiple database instances:

- **Development Database**: Public IP enabled for convenience
- **Production Database**: Private IP only for security

### Configuration Options

#### Development Only
```hcl
# terraform.tfvars
enable_dev_instance = true
enable_prod_instance = false
dev_authorized_networks = ["0.0.0.0/0"]  # Open for development
```

#### Production Only
```hcl
# terraform.tfvars
enable_dev_instance = false
enable_prod_instance = true
prod_tier = "db-n1-standard-1"  # Larger instance for production
prod_deletion_protection = true
```

#### Both Environments
```hcl
# terraform.tfvars
enable_dev_instance = true
enable_prod_instance = true
dev_authorized_networks = ["YOUR_IP/32"]  # Restrict access
prod_tier = "db-n1-standard-1"
prod_deletion_protection = true
```

## Application Configuration

### Environment-Aware Database Selection

The application automatically selects the appropriate database based on the environment:

1. **Development**: Uses `DATABASE_URL` from `.env.local`
2. **Production**: Uses `DATABASE_PROD_URL` or falls back to `DATABASE_URL`

### Environment Files

#### Development (`.env.local`)
```env
NODE_ENV=development
DATABASE_URL=postgresql://rlp_user:password@dev_public_ip:5432/rlp_database
```

#### Production (App Engine Environment Variables)
```env
NODE_ENV=production
DATABASE_PROD_URL=postgresql://rlp_user:password@prod_private_ip:5432/rlp_database
DATABASE_PROD_CONNECTION_NAME=project:region:project-postgres-prod
```

## Deployment Workflow

### 1. Development Deployment

```bash
# Deploy development infrastructure
cd terraform
terraform apply -var="enable_dev_instance=true" -var="enable_prod_instance=false"

# Get development database URL
terraform output database_dev_url

# Update your .env.local with the development database URL
# Then deploy the application
npm run db:setup
npm run build
gcloud app deploy
```

### 2. Production Deployment

```bash
# Deploy production infrastructure
cd terraform
terraform apply -var="enable_dev_instance=false" -var="enable_prod_instance=true"

# Get production database URL
terraform output database_prod_url

# Set App Engine environment variables
gcloud app deploy --set-env-vars DATABASE_URL="$(terraform output -raw database_prod_url)"
```

### 3. Both Environments

```bash
# Deploy both environments
cd terraform
terraform apply -var="enable_dev_instance=true" -var="enable_prod_instance=true"

# Get both database URLs
terraform output database_dev_url
terraform output database_prod_url

# Deploy to development
export DATABASE_URL="$(terraform output -raw database_dev_url)"
npm run db:setup
npm run build
gcloud app deploy --version dev

# Deploy to production
gcloud app deploy --version prod --set-env-vars DATABASE_URL="$(terraform output -raw database_prod_url)"
```

## Database Management

### Development Database

```bash
# Connect to development database (public IP)
npm run db:studio

# Run migrations on development
npm run db:push

# Seed development data
npm run db:seed
```

### Production Database

```bash
# Connect to production database (requires Cloud SQL Proxy)
./cloud-sql-proxy $(terraform output -raw database_prod_connection_name) --private-ip

# Run migrations on production
DATABASE_URL="$(terraform output -raw database_prod_url)" npm run db:push
```

## Security Considerations

### Development
- ✅ Public IP enabled for convenience
- ⚠️ Restrict authorized networks when possible
- ⚠️ Use strong passwords
- ⚠️ Monitor access logs

### Production
- ✅ Private IP only
- ✅ Deletion protection enabled
- ✅ Larger instance tier
- ✅ Comprehensive backup strategy
- ✅ Monitor access logs

## Migration Strategy

### From Single to Multi-Environment

1. **Backup existing data**
   ```bash
   pg_dump $EXISTING_DATABASE_URL > backup.sql
   ```

2. **Deploy new infrastructure**
   ```bash
   terraform apply -var="enable_dev_instance=true" -var="enable_prod_instance=true"
   ```

3. **Migrate data**
   ```bash
   # To development
   psql $(terraform output -raw database_dev_url) < backup.sql
   
   # To production
   psql $(terraform output -raw database_prod_url) < backup.sql
   ```

4. **Update application configuration**
   - Update environment variables
   - Test both environments
   - Deploy to production

## Monitoring and Maintenance

### Database Monitoring

- Set up Cloud SQL monitoring
- Configure alerts for:
  - High CPU usage
  - Low disk space
  - Connection errors
  - Slow queries

### Backup Strategy

- Development: Daily backups (7 days retention)
- Production: Daily backups (30 days retention)
- Point-in-time recovery enabled

### Maintenance Windows

- Development: Any time
- Production: Scheduled maintenance windows
- Use App Engine traffic splitting for zero-downtime deployments

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check environment variables
   - Verify IP access configuration
   - Test with Cloud SQL Proxy

2. **Migration failures**
   - Check database permissions
   - Verify schema compatibility
   - Review Prisma logs

3. **Performance issues**
   - Monitor database metrics
   - Consider upgrading instance tier
   - Optimize queries

### Support Commands

```bash
# Check database status
terraform output

# Test database connection
npm run db:setup

# View database logs
gcloud sql logs tail --instance=your-instance-name

# Connect to database
npm run db:studio
```
