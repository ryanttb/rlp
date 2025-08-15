# Database Setup Guide for RLP

This guide will help you set up the PostgreSQL database for the Rapid Liquid Printing (RLP) application using Prisma.

## Prerequisites

- Node.js 18+ installed
- GCP project with Cloud SQL PostgreSQL instance running
- Terraform infrastructure deployed
- Access to your GCP project

## Quick Start

### 1. Environment Setup

Copy the environment example file and configure your database connection:

```bash
cp env.example .env.local
```

Edit `.env.local` and update the `DATABASE_URL` with your Cloud SQL connection details:

```env
DATABASE_URL=postgresql://rlp_user:your_password@your_private_ip:5432/rlp_database
```

**Important**: Replace the following values:
- `your_password`: The password you set in your Terraform variables
- `your_private_ip`: The private IP address of your Cloud SQL instance (get this from Terraform outputs)

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database Schema

Run the database setup script:

```bash
npm run db:setup
```

This script will:
- Generate the Prisma client
- Push the database schema to your PostgreSQL instance
- Seed the database with initial data (if available)
- Optionally open Prisma Studio for database inspection

## Manual Setup Steps

If you prefer to run the steps manually:

### Generate Prisma Client

```bash
npm run db:generate
```

### Push Database Schema

```bash
npm run db:push
```

### Seed Database (Optional)

```bash
npm run db:seed
```

### Open Prisma Studio

```bash
npm run db:studio
```

## Database Schema

The application uses the following database schema:

### Tables

- **users** - User accounts and authentication
- **models** - 3D model files and metadata
- **printers** - Available 3D printers
- **print_jobs** - Print job queue and status
- **workflows** - Automated workflow definitions

### Key Features

- Full CRUD operations for all entities
- Relational data with foreign key constraints
- Automatic timestamps (createdAt, updatedAt)
- Soft delete support via status fields
- Optimized for 3D printing workflows

## Migration Management

For future schema changes, use the migration script:

### Create a New Migration

```bash
npm run db:migrate create
```

### Apply Pending Migrations

```bash
npm run db:migrate apply
```

### Check Migration Status

```bash
npm run db:migrate status
```

### Reset Database (⚠️ Destructive)

```bash
npm run db:migrate reset
```

## Troubleshooting

### Connection Issues

1. **Check your DATABASE_URL format**:
   ```
   postgresql://username:password@host:port/database
   ```

2. **Verify Cloud SQL instance is running**:
   ```bash
   gcloud sql instances list
   ```

3. **Check private IP connectivity**:
   ```bash
   gcloud sql instances describe your-instance-name
   ```

### Permission Issues

1. **Verify database user exists**:
   ```bash
   gcloud sql users list --instance=your-instance-name
   ```

2. **Check database permissions**:
   ```bash
   gcloud sql databases list --instance=your-instance-name
   ```

### Prisma Issues

1. **Reset Prisma client**:
   ```bash
   npx prisma generate
   ```

2. **Check schema syntax**:
   ```bash
   npx prisma validate
   ```

3. **View database introspection**:
   ```bash
   npx prisma db pull
   ```

## Development Workflow

### Local Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Make schema changes in `prisma/schema.prisma`

3. Push changes to database:
   ```bash
   npm run db:push
   ```

4. Generate updated client:
   ```bash
   npm run db:generate
   ```

### Production Deployment

The database setup is automatically handled during deployment via the `scripts/deploy.sh` script, which calls the database setup functions.

## Security Considerations

- Database connection uses private IP addresses only
- No public IP access to Cloud SQL instance
- Database credentials stored in environment variables
- Regular backups configured via Terraform
- Point-in-time recovery enabled

## Monitoring

- Use Prisma Studio for database inspection: `npm run db:studio`
- Monitor Cloud SQL metrics in GCP Console
- Check application logs for database errors
- Use Cloud Logging for detailed query analysis

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Cloud SQL logs in GCP Console
3. Verify Terraform outputs match your configuration
4. Ensure all required GCP APIs are enabled
