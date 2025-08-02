import { categoryService, modelService } from './firestore';
import { defaultCategories } from './defaultData';
import { Model } from '@/types/models';

// Sample models for testing
const sampleModels: Omit<Model, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Gear Assembly',
    description: 'A complex gear assembly with multiple interlocking gears for mechanical applications',
    category: 'Mechanical Parts',
    tags: ['gears', 'mechanical', 'assembly', 'engineering'],
    fileUrl: 'https://example.com/models/gear-assembly.stl',
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
    fileUrl: 'https://example.com/models/artistic-vase.obj',
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
    fileUrl: 'https://example.com/models/phone-stand.stl',
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
    fileSize: 768000, // 750KB
    fileType: 'stl',
    dimensions: { width: 25, height: 15, depth: 8 },
    userId: 'demo-user',
    status: 'processing',
    printSettings: {
      layerHeight: 0.2,
      infill: 40,
      support: false,
      material: 'pla',
    },
  },
];

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Seed categories
    console.log('Seeding categories...');
    const categoryPromises = defaultCategories.map(category => 
      categoryService.createCategory(category)
    );
    const categoryIds = await Promise.all(categoryPromises);
    console.log(`Created ${categoryIds.length} categories`);

    // Seed sample models
    console.log('Seeding sample models...');
    const modelPromises = sampleModels.map(model => 
      modelService.createModel(model)
    );
    const modelIds = await Promise.all(modelPromises);
    console.log(`Created ${modelIds.length} sample models`);

    console.log('Database seeding completed successfully!');
    return { categoryIds, modelIds };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export const clearDatabase = async () => {
  try {
    console.log('Clearing database...');
    
    // Get all categories and models
    const categories = await categoryService.getCategories();
    const models = await modelService.getModels();
    
    // Delete all models
    const modelDeletePromises = models.map(model => 
      modelService.deleteModel(model.id)
    );
    await Promise.all(modelDeletePromises);
    
    // Delete all categories
    const categoryDeletePromises = categories.map(category => 
      categoryService.deleteCategory(category.id)
    );
    await Promise.all(categoryDeletePromises);
    
    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

export const checkDatabaseStatus = async () => {
  try {
    const categories = await categoryService.getCategories();
    const models = await modelService.getModels();
    
    return {
      categories: categories.length,
      models: models.length,
      hasData: categories.length > 0 || models.length > 0,
    };
  } catch (error) {
    console.error('Error checking database status:', error);
    throw error;
  }
}; 