'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { Model } from '@/types/models';
import { modelService } from '@/lib/firestore';

interface ModelCardProps {
  model: Model;
  onDelete?: (id: string) => void;
  onEdit?: (model: Model) => void;
  onView?: (model: Model) => void;
}

const ModelCard: FC<ModelCardProps> = ({ model, onDelete, onEdit, onView }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: Model['status']) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'uploading':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'stl':
        return '🔺';
      case 'obj':
        return '📐';
      case '3mf':
        return '📦';
      case 'ply':
        return '🔷';
      case 'fbx':
        return '🎬';
      case 'dae':
        return '🌐';
      default:
        return '📄';
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this model?')) return;
    
    setIsDeleting(true);
    try {
      await modelService.deleteModel(model.id);
      onDelete?.(model.id);
    } catch (error) {
      console.error('Error deleting model:', error);
      alert('Failed to delete model');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group">
      {/* Thumbnail/Preview */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
        {model.thumbnailUrl ? (
          <Image
            src={model.thumbnailUrl}
            alt={model.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-2">{getFileTypeIcon(model.fileType)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-medium">
              {model.fileType}
            </p>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
            {model.status}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-gray-600 dark:text-gray-300">⋯</span>
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <button
                onClick={() => {
                  onView?.(model);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
              >
                👁️ View Model
              </button>
              <button
                onClick={() => {
                  onEdit?.(model);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                ✏️ Edit Details
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg disabled:opacity-50"
              >
                {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {model.name}
          </h3>
          {model.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {model.description}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <span>File Size:</span>
            <span className="font-medium">{formatFileSize(model.fileSize)}</span>
          </div>
          <div className="flex justify-between">
            <span>Format:</span>
            <span className="font-medium uppercase">{model.fileType}</span>
          </div>
          <div className="flex justify-between">
            <span>Category:</span>
            <span className="font-medium capitalize">{model.category}</span>
          </div>
          <div className="flex justify-between">
            <span>Uploaded:</span>
            <span className="font-medium">{formatDate(model.createdAt)}</span>
          </div>
        </div>

        {/* Tags */}
        {model.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {model.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {model.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                  +{model.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => onView?.(model)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            View Model
          </button>
          <button
            onClick={() => onEdit?.(model)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard; 