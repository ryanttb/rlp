'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import ModelGallery from '@/components/ModelGallery';
import ModelViewer from '@/components/ModelViewer';
import ModelEditModal from '@/components/ModelEditModal';
import Header from '@/components/Header';
import { Model } from '@/types/models';

const ModelsPage: FC = () => {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleModelView = (model: Model) => {
    setSelectedModel(model);
  };

  const handleCloseViewer = () => {
    setSelectedModel(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingModel(null);
  };

  const handleModelSave = (updatedModel: Model) => {
    // Trigger a refresh of the ModelGallery to show updated data
    setRefreshTrigger(prev => prev + 1);
    console.log('Model updated:', updatedModel);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ModelGallery
          onModelView={handleModelView}
          refreshTrigger={refreshTrigger}
        />
      </main>

      {/* Model Viewer Modal */}
      {selectedModel && (
        <ModelViewer
          model={selectedModel}
          onClose={handleCloseViewer}
        />
      )}

      {/* Model Edit Modal */}
      <ModelEditModal
        model={editingModel}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleModelSave}
      />
    </div>
  );
};

export default ModelsPage; 