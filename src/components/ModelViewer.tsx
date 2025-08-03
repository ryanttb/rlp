'use client';

import { FC, useState } from 'react';
import { Model } from '@/types/models';
import ThreeJSViewer from './ThreeJSViewer';

interface ModelViewerProps {
  model: Model;
  onClose: () => void;
}

const ModelViewer: FC<ModelViewerProps> = ({ model, onClose }) => {
  const [viewMode, setViewMode] = useState<'3d' | 'info' | 'settings'>('3d');

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {model.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {model.fileType.toUpperCase()} • {formatFileSize(model.fileSize)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-6 py-3 font-medium transition-colors ${
              viewMode === '3d'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            👁️ 3D Viewer
          </button>
          <button
            onClick={() => setViewMode('info')}
            className={`px-6 py-3 font-medium transition-colors ${
              viewMode === 'info'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            📋 Information
          </button>
          <button
            onClick={() => setViewMode('settings')}
            className={`px-6 py-3 font-medium transition-colors ${
              viewMode === 'settings'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ⚙️ Print Settings
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {viewMode === '3d' && (
            <div className="p-6">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96">
                <ThreeJSViewer
                  fileUrl={model.fileUrl}
                  fileType={model.fileType}
                  dimensions={model.dimensions}
                />
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Download Model
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Share Model
                </button>
              </div>
            </div>
          )}

          {viewMode === 'info' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Model Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Name:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{model.name}</span>
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
                      <span className="text-gray-600 dark:text-gray-300">Category:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{model.category}</span>
                    </div>
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
                      <span className="text-gray-600 dark:text-gray-300">Created:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatDate(model.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Updated:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatDate(model.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
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

                  {model.description && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Description
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {model.description}
                      </p>
                    </div>
                  )}

                  {model.tags.length > 0 && (
                    <div className="mt-6">
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
                </div>
              </div>
            </div>
          )}

          {viewMode === 'settings' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Current Print Settings
                  </h3>
                  {model.printSettings ? (
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
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">No print settings configured for this model.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Add to Print Queue
                    </button>
                    <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Edit Print Settings
                    </button>
                    <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Generate G-Code
                    </button>
                    <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Export Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelViewer; 