'use client';

import { FC, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Model } from '@/types/models';
import { modelService } from '@/lib/firestore';
import ModelViewer from '@/components/ModelViewer';
import Header from '@/components/Header';

const ModelDetailPage: FC = () => {
  const params = useParams();
  const modelId = params.id as string;
  
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      if (!modelId) return;
      
      try {
        setLoading(true);
        const modelData = await modelService.getModel(modelId);
        
        if (!modelData) {
          setError('Model not found');
          return;
        }
        
        setModel(modelData);
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load model');
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, [modelId]);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading model...</p>
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error || 'Model not found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The model you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Link
            href="/models"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Models
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Header 
        title={model.name}
        subtitle={`${model.fileType.toUpperCase()} • ${formatFileSize(model.fileSize)}`}
        showActions={true}
        actions={
          <>
            <button
              onClick={() => setIsViewerOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              View Model
            </button>
            <Link
              href={`/models/${model.id}/edit`}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Edit
            </Link>
          </>
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Model Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Model Preview
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Interactive 3D visualization of your model
                </p>
              </div>
              <div className="p-6">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Click &quot;Open 3D Viewer&quot; to see the 3D preview
                    </p>
                    <button
                      onClick={() => setIsViewerOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Open 3D Viewer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Model Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    model.status === 'ready' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    model.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    model.status === 'uploading' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {model.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Category:</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{model.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">File Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white uppercase">{model.fileType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">File Size:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatFileSize(model.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Created:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatDate(model.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Updated:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatDate(model.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Dimensions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Width:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.dimensions.width}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Height:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.dimensions.height}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Depth:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{model.dimensions.depth}mm</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {model.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {model.description && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {model.description}
                </p>
              </div>
            )}

            {/* Print Settings */}
            {model.printSettings && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Print Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Layer Height:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{model.printSettings.layerHeight}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Infill:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{model.printSettings.infill}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Support:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {model.printSettings.support ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Material:</span>
                    <span className="font-medium text-gray-900 dark:text-white uppercase">{model.printSettings.material}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Model Viewer Modal */}
      {isViewerOpen && model && (
        <ModelViewer
          model={model}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default ModelDetailPage; 