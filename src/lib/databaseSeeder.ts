import { categoryService, modelService, printerService, printJobService } from './firestore';
import { defaultCategories } from './defaultData';
import { Model, Printer, PrintJob } from '@/types/models';

// Sample models for testing
const sampleModels: Omit<Model, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Gear Assembly',
    description: 'A complex gear assembly with multiple interlocking gears for mechanical applications',
    category: 'Mechanical Parts',
    tags: ['gears', 'mechanical', 'assembly', 'engineering'],
    fileUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/ascii/slotted_disk.stl',
    fileSize: 2048576, // 2MB
    fileType: 'stl',
    dimensions: { width: 50, height: 30, depth: 20 },
    userId: 'demo-user',
    status: 'ready',
    printSettings: {
      layerHeight: 0.2,
      infill: 30,
      support: false,
      material: 'pla',
    },
  },
  {
    name: 'Artistic Vase',
    description: 'Beautiful decorative vase with intricate geometric patterns',
    category: 'Art & Sculptures',
    tags: ['art', 'decorative', 'vase', 'geometric'],
    fileUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/male02/male02.obj',
    fileSize: 1048576, // 1MB
    fileType: 'obj',
    dimensions: { width: 15, height: 25, depth: 15 },
    userId: 'demo-user',
    status: 'ready',
    printSettings: {
      layerHeight: 0.15,
      infill: 20,
      support: false,
      material: 'pla',
    },
  },
  {
    name: 'Phone Stand',
    description: 'Ergonomic phone stand with cable management features',
    category: 'Household Items',
    tags: ['phone', 'stand', 'organizer', 'household'],
    fileUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/binary/pr2_head_pan.stl',
    fileSize: 512000, // 500KB
    fileType: 'stl',
    dimensions: { width: 8, height: 12, depth: 6 },
    userId: 'demo-user',
    status: 'ready',
    printSettings: {
      layerHeight: 0.2,
      infill: 25,
      support: false,
      material: 'petg',
    },
  },
  {
    name: 'Custom Wrench',
    description: 'Specialized wrench for hard-to-reach bolts in automotive applications',
    category: 'Tools & Equipment',
    tags: ['tool', 'wrench', 'automotive', 'custom'],
    fileUrl: 'https://example.com/models/custom-wrench.stl',
    fileSize: 1536000, // 1.5MB
    fileType: 'stl',
    dimensions: { width: 20, height: 5, depth: 3 },
    userId: 'demo-user',
    status: 'ready',
    printSettings: {
      layerHeight: 0.15,
      infill: 50,
      support: true,
      material: 'abs',
    },
  },
  {
    name: 'DNA Model',
    description: 'Educational DNA double helix model for biology classes',
    category: 'Educational',
    tags: ['education', 'biology', 'dna', 'science'],
    fileUrl: 'https://example.com/models/dna-model.3mf',
    fileSize: 3072000, // 3MB
    fileType: '3mf',
    dimensions: { width: 10, height: 40, depth: 10 },
    userId: 'demo-user',
    status: 'ready',
    printSettings: {
      layerHeight: 0.1,
      infill: 20,
      support: true,
      material: 'pla',
    },
  },
  {
    name: 'Bracket Prototype',
    description: 'Lightweight bracket design for mounting applications',
    category: 'Prototypes',
    tags: ['prototype', 'bracket', 'mounting', 'lightweight'],
    fileUrl: 'https://example.com/models/bracket-prototype.stl',
    fileSize: 1024000, // 1MB
    fileType: 'stl',
    dimensions: { width: 25, height: 15, depth: 8 },
    userId: 'demo-user',
    status: 'ready',
    printSettings: {
      layerHeight: 0.2,
      infill: 40,
      support: false,
      material: 'pla',
    },
  },
];

// Sample printers for testing
const samplePrinters: Omit<Printer, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Levity Pro X1',
    type: 'Levity',
    status: 'printing',
    location: 'Production Lab A',
    description: 'High-speed liquid printing system with advanced material handling',
    capabilities: {
      maxBuildVolume: { width: 300, height: 300, depth: 400 },
      supportedMaterials: ['PLA', 'ABS', 'PETG', 'TPU'],
      layerHeightRange: { min: 0.1, max: 0.3 }
    }
  },
  {
    name: 'Service Printer Alpha',
    type: 'Print as a Service',
    status: 'online',
    location: 'Service Center B',
    description: 'Cloud-connected service printer for remote operations',
    capabilities: {
      maxBuildVolume: { width: 250, height: 250, depth: 300 },
      supportedMaterials: ['PLA', 'ABS', 'Resin'],
      layerHeightRange: { min: 0.05, max: 0.2 }
    }
  },
  {
    name: 'Levity Mini',
    type: 'Levity',
    status: 'maintenance',
    location: 'R&D Lab',
    description: 'Compact liquid printing system for prototyping',
    capabilities: {
      maxBuildVolume: { width: 150, height: 150, depth: 200 },
      supportedMaterials: ['PLA', 'Resin'],
      layerHeightRange: { min: 0.1, max: 0.25 }
    }
  },
  {
    name: 'Production Printer Beta',
    type: 'Levity',
    status: 'online',
    location: 'Production Lab B',
    description: 'High-volume production printer for batch manufacturing',
    capabilities: {
      maxBuildVolume: { width: 400, height: 400, depth: 500 },
      supportedMaterials: ['PLA', 'ABS', 'PETG', 'TPU', 'PC'],
      layerHeightRange: { min: 0.08, max: 0.4 }
    }
  }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed categories
    console.log('📂 Seeding categories...');
    for (const category of defaultCategories) {
      try {
        await categoryService.createCategory(category);
        console.log(`✅ Created category: ${category.name}`);
      } catch (error) {
        console.log(`⚠️ Category ${category.name} might already exist`);
      }
    }

    // Seed models
    console.log('🎨 Seeding models...');
    const modelIds: string[] = [];
    for (const model of sampleModels) {
      try {
        const modelId = await modelService.createModel(model);
        modelIds.push(modelId);
        console.log(`✅ Created model: ${model.name} (ID: ${modelId})`);
      } catch (error) {
        console.log(`⚠️ Model ${model.name} might already exist`);
      }
    }

    // Seed printers
    console.log('🖨️ Seeding printers...');
    const printerIds: string[] = [];
    for (const printer of samplePrinters) {
      try {
        const printerId = await printerService.createPrinter(printer);
        printerIds.push(printerId);
        console.log(`✅ Created printer: ${printer.name} (ID: ${printerId})`);
      } catch (error) {
        console.log(`⚠️ Printer ${printer.name} might already exist`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary: ${modelIds.length} models, ${printerIds.length} printers`);
    return { modelIds, printerIds };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
  }
};

export const seedPrintQueue = async () => {
  try {
    console.log('📋 Starting print queue seeding...');

    // Get existing models and printers
    const [models, printers] = await Promise.all([
      modelService.getModels(),
      printerService.getPrinters()
    ]);

    if (models.length === 0 || printers.length === 0) {
      console.log('⚠️ No models or printers found. Please seed the database first.');
      return false;
    }

    // Sample print jobs (with actual model and printer IDs)
    const samplePrintJobs: Omit<PrintJob, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        modelId: models[0].id, // Gear Assembly
        printerId: printers[0].id,
        status: 'printing',
        priority: 'high',
        estimatedDuration: 180,
        actualDuration: 45,
        progress: 25,
        startedAt: new Date(Date.now() - 45 * 60 * 1000),
        userId: 'demo-user',
        printSettings: {
          layerHeight: 0.2,
          infill: 20,
          support: true,
          material: 'PLA',
          temperature: 200,
          bedTemperature: 60
        },
        notes: 'High priority prototype for client demo'
      },
      {
        modelId: models[1].id, // Artistic Vase
        printerId: printers[1].id,
        status: 'queued',
        priority: 'normal',
        estimatedDuration: 120,
        userId: 'demo-user',
        printSettings: {
          layerHeight: 0.15,
          infill: 15,
          support: false,
          material: 'ABS',
          temperature: 230,
          bedTemperature: 100
        }
      },
      {
        modelId: models[2].id, // Phone Stand
        printerId: printers[0].id,
        status: 'completed',
        priority: 'low',
        estimatedDuration: 90,
        actualDuration: 85,
        progress: 100,
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 35 * 60 * 1000),
        userId: 'demo-user',
        printSettings: {
          layerHeight: 0.2,
          infill: 25,
          support: false,
          material: 'PLA',
          temperature: 200,
          bedTemperature: 60
        },
        notes: 'Phone stand for office use'
      },
      {
        modelId: models[3].id, // Custom Wrench
        printerId: printers[3].id,
        status: 'preparing',
        priority: 'high',
        estimatedDuration: 150,
        userId: 'demo-user',
        printSettings: {
          layerHeight: 0.15,
          infill: 50,
          support: true,
          material: 'ABS',
          temperature: 230,
          bedTemperature: 100
        },
        notes: 'Automotive tool for specialized applications'
      }
    ];

    // Create print jobs
    for (const printJob of samplePrintJobs) {
      try {
        await printJobService.createPrintJob(printJob);
        console.log(`✅ Created print job for model: ${printJob.modelId}`);
      } catch (error) {
        console.log(`⚠️ Print job for model ${printJob.modelId} might already exist`);
      }
    }

    console.log('🎉 Print queue seeding completed successfully!');
    console.log(`📊 Summary: ${samplePrintJobs.length} print jobs created`);
    return true;
  } catch (error) {
    console.error('❌ Error seeding print queue:', error);
    return false;
  }
};

export const clearDatabase = async () => {
  try {
    console.log('🧹 Starting database cleanup...');

    // Get all documents
    const [models, categories, printers, printJobs] = await Promise.all([
      modelService.getModels(),
      categoryService.getCategories(),
      printerService.getPrinters(),
      printJobService.getPrintJobs()
    ]);

    // Delete all documents
    const deletePromises = [
      ...models.map(model => modelService.deleteModel(model.id)),
      ...categories.map(category => categoryService.deleteCategory(category.id)),
      ...printers.map(printer => printerService.deletePrinter(printer.id)),
      ...printJobs.map(job => printJobService.deletePrintJob(job.id))
    ];

    await Promise.all(deletePromises);

    console.log('✅ Database cleared successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    return false;
  }
};

export const checkDatabaseStatus = async () => {
  try {
    const [models, categories, printers, printJobs] = await Promise.all([
      modelService.getModels(),
      categoryService.getCategories(),
      printerService.getPrinters(),
      printJobService.getPrintJobs()
    ]);

    return {
      models: models.length,
      categories: categories.length,
      printers: printers.length,
      printJobs: printJobs.length,
      total: models.length + categories.length + printers.length + printJobs.length
    };
  } catch (error) {
    console.error('❌ Error checking database status:', error);
    return null;
  }
}; 