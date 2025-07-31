import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Model, Category, ModelFilters } from '@/types/models';

// Collection references
const modelsCollection = collection(db, 'models');
const categoriesCollection = collection(db, 'categories');

// Model CRUD operations
export const modelService = {
  // Get all models with optional filters
  async getModels(filters?: ModelFilters): Promise<Model[]> {
    try {
      let q = query(modelsCollection, orderBy('createdAt', 'desc'));
      
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      if (filters?.fileType && filters.fileType.length > 0) {
        q = query(q, where('fileType', 'in', filters.fileType));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Model[];
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },

  // Get a single model by ID
  async getModel(id: string): Promise<Model | null> {
    try {
      const docRef = doc(modelsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        } as Model;
      }
      return null;
    } catch (error) {
      console.error('Error fetching model:', error);
      throw error;
    }
  },

  // Create a new model
  async createModel(modelData: Omit<Model, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(modelsCollection, {
        ...modelData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating model:', error);
      throw error;
    }
  },

  // Update a model
  async updateModel(id: string, updates: Partial<Model>): Promise<void> {
    try {
      const docRef = doc(modelsCollection, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating model:', error);
      throw error;
    }
  },

  // Delete a model
  async deleteModel(id: string): Promise<void> {
    try {
      const docRef = doc(modelsCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  },

  // Get models by user ID
  async getModelsByUser(userId: string): Promise<Model[]> {
    try {
      const q = query(
        modelsCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Model[];
    } catch (error) {
      console.error('Error fetching user models:', error);
      throw error;
    }
  },
};

// Category CRUD operations
export const categoryService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const snapshot = await getDocs(categoriesCollection);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create a new category
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(categoriesCollection, {
        ...categoryData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update a category
  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    try {
      const docRef = doc(categoriesCollection, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    try {
      const docRef = doc(categoriesCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
}; 