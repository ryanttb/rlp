'use client';

import { FC, useState } from 'react';
import { Printer } from '@/types/models';

interface AddPrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (printer: Omit<Printer, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const AddPrinterModal: FC<AddPrinterModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Levity' as Printer['type'],
    status: 'online' as Printer['status'],
    location: '',
    description: '',
    maxBuildVolumeWidth: '',
    maxBuildVolumeHeight: '',
    maxBuildVolumeDepth: '',
    supportedMaterials: '',
    layerHeightMin: '',
    layerHeightMax: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const printer: Omit<Printer, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      type: formData.type,
      status: formData.status,
      location: formData.location || undefined,
      description: formData.description || undefined,
      capabilities: {
        maxBuildVolume: formData.maxBuildVolumeWidth && formData.maxBuildVolumeHeight && formData.maxBuildVolumeDepth ? {
          width: parseInt(formData.maxBuildVolumeWidth),
          height: parseInt(formData.maxBuildVolumeHeight),
          depth: parseInt(formData.maxBuildVolumeDepth)
        } : undefined,
        supportedMaterials: formData.supportedMaterials ? formData.supportedMaterials.split(',').map(m => m.trim()) : undefined,
        layerHeightRange: formData.layerHeightMin && formData.layerHeightMax ? {
          min: parseFloat(formData.layerHeightMin),
          max: parseFloat(formData.layerHeightMax)
        } : undefined
      }
    };

    onAdd(printer);
    
    // Reset form
    setFormData({
      name: '',
      type: 'Levity',
      status: 'online',
      location: '',
      description: '',
      maxBuildVolumeWidth: '',
      maxBuildVolumeHeight: '',
      maxBuildVolumeDepth: '',
      supportedMaterials: '',
      layerHeightMin: '',
      layerHeightMax: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Printer
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Printer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Levity Pro X1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Levity">Levity</option>
                  <option value="Print as a Service">Print as a Service</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="printing">Printing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Production Lab A"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Brief description of the printer..."
              />
            </div>

            {/* Build Volume */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Build Volume (mm)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Width
                  </label>
                  <input
                    type="number"
                    value={formData.maxBuildVolumeWidth}
                    onChange={(e) => handleInputChange('maxBuildVolumeWidth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height
                  </label>
                  <input
                    type="number"
                    value={formData.maxBuildVolumeHeight}
                    onChange={(e) => handleInputChange('maxBuildVolumeHeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Depth
                  </label>
                  <input
                    type="number"
                    value={formData.maxBuildVolumeDepth}
                    onChange={(e) => handleInputChange('maxBuildVolumeDepth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="400"
                  />
                </div>
              </div>
            </div>

            {/* Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supported Materials
              </label>
              <input
                type="text"
                value={formData.supportedMaterials}
                onChange={(e) => handleInputChange('supportedMaterials', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="PLA, ABS, PETG, TPU (comma-separated)"
              />
            </div>

            {/* Layer Height Range */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Layer Height Range (mm)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.layerHeightMin}
                    onChange={(e) => handleInputChange('layerHeightMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.layerHeightMax}
                    onChange={(e) => handleInputChange('layerHeightMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.3"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Printer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPrinterModal; 