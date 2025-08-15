import { PrismaClient } from '@prisma/client';
import { getDatabaseConfig } from './database-config';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create Prisma client with environment-aware configuration
const createPrismaClient = () => {
  const config = getDatabaseConfig();
  
  return new PrismaClient({
    datasources: {
      db: {
        url: config.url,
      },
    },
    log: config.isProduction ? ['error'] : ['query', 'error', 'warn'],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 