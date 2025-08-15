/**
 * Environment-aware database configuration
 * Automatically selects the appropriate database based on environment
 */

export interface DatabaseConfig {
  url: string;
  connectionName?: string;
  isProduction: boolean;
}

export function getDatabaseConfig(): DatabaseConfig {
  const environment = process.env.NODE_ENV || 'development';
  const isProduction = environment === 'production';

  // For local development, use the environment variable directly
  if (environment === 'development') {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required for development');
    }
    
    return {
      url: databaseUrl,
      isProduction: false,
    };
  }

  // For production (App Engine), use environment-specific variables
  if (isProduction) {
    // Check if we have a production-specific database URL
    const prodDatabaseUrl = process.env.DATABASE_PROD_URL;
    if (prodDatabaseUrl) {
      return {
        url: prodDatabaseUrl,
        connectionName: process.env.DATABASE_PROD_CONNECTION_NAME,
        isProduction: true,
      };
    }

    // Fallback to the main DATABASE_URL (should be production)
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL or DATABASE_PROD_URL environment variable is required for production');
    }

    return {
      url: databaseUrl,
      connectionName: process.env.DATABASE_CONNECTION_NAME,
      isProduction: true,
    };
  }

  // For other environments (staging, etc.)
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  return {
    url: databaseUrl,
    connectionName: process.env.DATABASE_CONNECTION_NAME,
    isProduction: false,
  };
}

/**
 * Get the appropriate DATABASE_URL for the current environment
 * This is used by Prisma
 */
export function getDatabaseUrl(): string {
  return getDatabaseConfig().url;
}

/**
 * Check if we're running in production
 */
export function isProduction(): boolean {
  return getDatabaseConfig().isProduction;
}

/**
 * Get connection name for Cloud SQL Proxy (if needed)
 */
export function getConnectionName(): string | undefined {
  return getDatabaseConfig().connectionName;
}
