'use client';

import { FC, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Model } from '@/types/models';
import { modelService } from '@/lib/firestore';
import ModelEditModal from '@/components/ModelEditModal';

const ModelEditPage: FC = () => {
  const router = useRouter();
  const params = useParams();
  const modelId = params.id as string;
  
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        setIsEditModalOpen(true);
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load model');
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, [modelId]);

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    router.push('/models');
  };

  const handleModelSave = (updatedModel: Model) => {
    setModel(updatedModel);
    // Redirect back to models page after a short delay
    setTimeout(() => {
      router.push('/models');
    }, 1000);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The model you're looking for doesn't exist or you don't have permission to edit it.
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
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link href="/" className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">RLP</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Model
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {model?.name}
                </p>
              </div>
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Opening edit form...</p>
        </div>
      </main>

      {/* Model Edit Modal */}
      <ModelEditModal
        model={model}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleModelSave}
      />
    </div>
  );
};

export default ModelEditPage; 