# Cloud SQL Security Configuration

## IP Access Configuration

This Terraform configuration supports both public and private IP access for Cloud SQL, with configurable security settings.

## Configuration Options

### Variables

- `enable_public_ip` (bool, default: true) - Enable public IP access
- `authorized_networks` (list, default: ["0.0.0.0/0"]) - Allowed IP ranges for public access

### Security Levels

#### 1. Private IP Only (Most Secure)
```hcl
enable_public_ip = false
```
- Database only accessible from within the VPC
- Requires Cloud SQL Proxy or VPC connectivity
- Best for production environments

#### 2. Public IP with Restricted Networks (Moderate)
```hcl
enable_public_ip = true
authorized_networks = ["YOUR_IP/32", "OFFICE_NETWORK/24"]
```
- Database accessible from specific IP ranges
- Good for development with team access
- Requires knowing your IP addresses

#### 3. Public IP Open (Least Secure - Development Only)
```hcl
enable_public_ip = true
authorized_networks = ["0.0.0.0/0"]
```
- Database accessible from anywhere
- **WARNING: Only use for development/testing**
- Never use in production

## Environment-Specific Configurations

### Development
```hcl
enable_public_ip = true
authorized_networks = ["0.0.0.0/0"]  # Open for convenience
```

### Staging
```hcl
enable_public_ip = true
authorized_networks = ["OFFICE_IP/32", "CI_CD_IP/32"]
```

### Production
```hcl
enable_public_ip = false  # Private IP only
```

## Best Practices

1. **Never use open public IP in production**
2. **Use the principle of least privilege**
3. **Regularly review authorized networks**
4. **Monitor database access logs**
5. **Use strong passwords and consider IAM authentication**

## Migration Guide

### From Public to Private IP

1. Update Terraform variables:
   ```hcl
   enable_public_ip = false
   ```

2. Apply changes:
   ```bash
   terraform apply
   ```

3. Update application to use Cloud SQL Proxy or VPC connectivity

### From Private to Public IP

1. Update Terraform variables:
   ```hcl
   enable_public_ip = true
   authorized_networks = ["YOUR_IP/32"]
   ```

2. Apply changes:
   ```bash
   terraform apply
   ```

3. Update application DATABASE_URL to use public IP

## Monitoring and Alerts

Consider setting up:
- Cloud SQL audit logs
- VPC flow logs
- Security Command Center alerts
- Database access monitoring

## Compliance Notes

- Public IP access may violate some compliance requirements
- Private IP only is recommended for HIPAA, PCI, and other regulated environments
- Document your security decisions and review regularly
