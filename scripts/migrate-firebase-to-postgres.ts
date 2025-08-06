#!/usr/bin/env ts-node

/**
 * Firebase to PostgreSQL Migration Script
 * 
 * This script helps migrate data from Firebase Firestore to PostgreSQL
 * Run this after setting up your PostgreSQL database with Prisma
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { PrismaClient } from '@prisma/client';

// Firebase configuration (use your existing config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

// Initialize Prisma
const prisma = new PrismaClient();

interface FirebaseModel {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  technology: string;
  status: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
}

interface FirebaseUser {
  id: string;
  email: string;
  name?: string;
  createdAt: any;
  updatedAt: any;
}

interface FirebasePrinter {
  id: string;
  name: string;
  model: string;
  technology: string;
  status: string;
  location?: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
}

interface FirebasePrintJob {
  id: string;
  status: string;
  priority: number;
  estimatedDuration?: number;
  actualDuration?: number;
  startedAt?: any;
  completedAt?: any;
  userId: string;
  modelId: string;
  printerId: string;
  createdAt: any;
  updatedAt: any;
}

async function migrateUsers() {
  console.log('🔄 Migrating users...');
  
  try {
    const usersSnapshot = await getDocs(collection(firestore, 'users'));
    const users: FirebaseUser[] = [];
    
    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      } as FirebaseUser);
    });
    
    console.log(`Found ${users.length} users to migrate`);
    
    for (const user of users) {
      try {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            email: user.email,
            name: user.name,
            updatedAt: new Date(),
          },
          create: {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt?.toDate() || new Date(),
            updatedAt: user.updatedAt?.toDate() || new Date(),
          },
        });
        console.log(`✅ Migrated user: ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to migrate user ${user.email}:`, error);
      }
    }
    
    console.log('✅ Users migration completed');
  } catch (error) {
    console.error('❌ Error migrating users:', error);
  }
}

async function migrateModels() {
  console.log('🔄 Migrating models...');
  
  try {
    const modelsSnapshot = await getDocs(collection(firestore, 'models'));
    const models: FirebaseModel[] = [];
    
    modelsSnapshot.forEach((doc) => {
      models.push({
        id: doc.id,
        ...doc.data()
      } as FirebaseModel);
    });
    
    console.log(`Found ${models.length} models to migrate`);
    
    for (const model of models) {
      try {
        await prisma.model.upsert({
          where: { id: model.id },
          update: {
            name: model.name,
            description: model.description,
            fileUrl: model.fileUrl,
            thumbnailUrl: model.thumbnailUrl,
            technology: model.technology,
            status: model.status,
            updatedAt: new Date(),
          },
          create: {
            id: model.id,
            name: model.name,
            description: model.description,
            fileUrl: model.fileUrl,
            thumbnailUrl: model.thumbnailUrl,
            technology: model.technology,
            status: model.status,
            userId: model.userId,
            createdAt: model.createdAt?.toDate() || new Date(),
            updatedAt: model.updatedAt?.toDate() || new Date(),
          },
        });
        console.log(`✅ Migrated model: ${model.name}`);
      } catch (error) {
        console.error(`❌ Failed to migrate model ${model.name}:`, error);
      }
    }
    
    console.log('✅ Models migration completed');
  } catch (error) {
    console.error('❌ Error migrating models:', error);
  }
}

async function migratePrinters() {
  console.log('🔄 Migrating printers...');
  
  try {
    const printersSnapshot = await getDocs(collection(firestore, 'printers'));
    const printers: FirebasePrinter[] = [];
    
    printersSnapshot.forEach((doc) => {
      printers.push({
        id: doc.id,
        ...doc.data()
      } as FirebasePrinter);
    });
    
    console.log(`Found ${printers.length} printers to migrate`);
    
    for (const printer of printers) {
      try {
        await prisma.printer.upsert({
          where: { id: printer.id },
          update: {
            name: printer.name,
            model: printer.model,
            technology: printer.technology,
            status: printer.status,
            location: printer.location,
            updatedAt: new Date(),
          },
          create: {
            id: printer.id,
            name: printer.name,
            model: printer.model,
            technology: printer.technology,
            status: printer.status,
            location: printer.location,
            userId: printer.userId,
            createdAt: printer.createdAt?.toDate() || new Date(),
            updatedAt: printer.updatedAt?.toDate() || new Date(),
          },
        });
        console.log(`✅ Migrated printer: ${printer.name}`);
      } catch (error) {
        console.error(`❌ Failed to migrate printer ${printer.name}:`, error);
      }
    }
    
    console.log('✅ Printers migration completed');
  } catch (error) {
    console.error('❌ Error migrating printers:', error);
  }
}

async function migratePrintJobs() {
  console.log('🔄 Migrating print jobs...');
  
  try {
    const printJobsSnapshot = await getDocs(collection(firestore, 'printJobs'));
    const printJobs: FirebasePrintJob[] = [];
    
    printJobsSnapshot.forEach((doc) => {
      printJobs.push({
        id: doc.id,
        ...doc.data()
      } as FirebasePrintJob);
    });
    
    console.log(`Found ${printJobs.length} print jobs to migrate`);
    
    for (const printJob of printJobs) {
      try {
        await prisma.printJob.upsert({
          where: { id: printJob.id },
          update: {
            status: printJob.status,
            priority: printJob.priority,
            estimatedDuration: printJob.estimatedDuration,
            actualDuration: printJob.actualDuration,
            startedAt: printJob.startedAt?.toDate(),
            completedAt: printJob.completedAt?.toDate(),
            updatedAt: new Date(),
          },
          create: {
            id: printJob.id,
            status: printJob.status,
            priority: printJob.priority,
            estimatedDuration: printJob.estimatedDuration,
            actualDuration: printJob.actualDuration,
            startedAt: printJob.startedAt?.toDate(),
            completedAt: printJob.completedAt?.toDate(),
            userId: printJob.userId,
            modelId: printJob.modelId,
            printerId: printJob.printerId,
            createdAt: printJob.createdAt?.toDate() || new Date(),
            updatedAt: printJob.updatedAt?.toDate() || new Date(),
          },
        });
        console.log(`✅ Migrated print job: ${printJob.id}`);
      } catch (error) {
        console.error(`❌ Failed to migrate print job ${printJob.id}:`, error);
      }
    }
    
    console.log('✅ Print jobs migration completed');
  } catch (error) {
    console.error('❌ Error migrating print jobs:', error);
  }
}

async function main() {
  console.log('🚀 Starting Firebase to PostgreSQL migration...');
  
  try {
    // Migrate in order to respect foreign key constraints
    await migrateUsers();
    await migrateModels();
    await migratePrinters();
    await migratePrintJobs();
    
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  main();
}

export { main as migrateFirebaseToPostgres }; 