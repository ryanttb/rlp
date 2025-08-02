'use client';

import { FC, useState, useEffect, useMemo } from 'react';
import { Model } from '@/types/models';
import { modelService, categoryService } from '@/lib/firestore';
import { Category } from '@/types/models';
import ModelCard from './ModelCard';
import ModelUpload from './ModelUpload';

interface ModelGalleryProps {
  onModelView?: (model: Model) => void;
  onModelEdit?: (model: Model) => void;
  refreshTrigger?: number;
}

const ModelGallery: FC<ModelGalleryProps> = ({ onModelView, onModelEdit, refreshTrigger }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'fileSize'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load models and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [modelsData, categoriesData] = await Promise.all([
          modelService.getModels(),
          categoryService.getCategories(),
        ]);
        setModels(modelsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load models and categories');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshTrigger]);

  // Filter and sort models
  const filteredAndSortedModels = useMemo(() => {
    const filtered = models.filter(model => {
      // Search query
      if (searchQuery && !model.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !model.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory && model.category !== selectedCategory) {
        return false;
      }
      
      // Status filter
      if (selectedStatus && model.status !== selectedStatus) {
        return false;
      }
      
      // File type filter
      if (selectedFileType && model.fileType !== selectedFileType) {
        return false;
      }
      
      return true;
    });

    // Sort models
    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': {
          const aValue = a.name.toLowerCase();
          const bValue = b.name.toLowerCase();
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        }
        case 'createdAt': {
          const aValue = a.createdAt.getTime();
          const bValue = b.createdAt.getTime();
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        }
        case 'fileSize': {
          const aValue = a.fileSize;
          const bValue = b.fileSize;
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [models, searchQuery, selectedCategory, selectedStatus, selectedFileType, sortBy, sortOrder]);

  const handleModelDelete = (modelId: string) => {
    setModels(prev => prev.filter(model => model.id !== modelId));
  };

  const handleUploadComplete = (newModel: Model) => {
    setModels(prev => [newModel, ...prev]);
    setShowUpload(false);
  };

  const handleUploadError = (error: string) => {
    alert(`Upload failed: ${error}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedFileType('');
  };

  const fileTypes = ['stl', 'obj', '3mf', 'ply', 'fbx', 'dae'];
  const statuses = ['ready', 'processing', 'uploading', 'error'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            3D Model Gallery
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {filteredAndSortedModels.length} of {models.length} models
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Upload Model
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upload 3D Model
              </h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <ModelUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* File Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File Type
            </label>
            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {fileTypes.map(type => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort and Clear Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'createdAt' | 'fileSize')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="createdAt">Date</option>
              <option value="name">Name</option>
              <option value="fileSize">File Size</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Models Grid */}
      {filteredAndSortedModels.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <span className="text-6xl">📁</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No models found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {models.length === 0 
              ? "You haven't uploaded any 3D models yet. Start by uploading your first model!"
              : "No models match your current filters. Try adjusting your search criteria."
            }
          </p>
          {models.length === 0 && (
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Upload Your First Model
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedModels.map(model => (
            <ModelCard
              key={model.id}
              model={model}
              onDelete={handleModelDelete}
              onEdit={onModelEdit}
              onView={onModelView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelGallery; 