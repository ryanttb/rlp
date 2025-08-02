'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import ModelGallery from '@/components/ModelGallery';
import ModelViewer from '@/components/ModelViewer';
import { Model } from '@/types/models';

const ModelsPage: FC = () => {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const handleModelView = (model: Model) => {
    setSelectedModel(model);
  };

  const handleModelEdit = (model: Model) => {
    // TODO: Implement model edit modal/form
    console.log('Edit model:', model);
    alert(`Editing model: ${model.name}`);
  };

  const handleCloseViewer = () => {
    setSelectedModel(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">RLP</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Rapid Liquid Printing
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/models" className="text-blue-600 dark:text-blue-400 font-semibold">
                3D Models
              </Link>
              <Link href="/queue" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Print Queue
              </Link>
              <Link href="/workflows" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Workflows
              </Link>
              <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ModelGallery
          onModelView={handleModelView}
          onModelEdit={handleModelEdit}
        />
      </main>

      {/* Model Viewer Modal */}
      {selectedModel && (
        <ModelViewer
          model={selectedModel}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
};

export default ModelsPage; 