'use client';

import { FC, useState } from 'react';
import { Printer } from '@/types/models';

interface PrinterCardProps {
  printer: Printer;
  onStatusChange: (status: Printer['status']) => void;
}

const PrinterCard: FC<PrinterCardProps> = ({ printer, onStatusChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusColor = (status: Printer['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'printing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Printer['status']) => {
    switch (status) {
      case 'online': return '🟢';
      case 'printing': return '🔄';
      case 'maintenance': return '🔧';
      case 'offline': return '🔴';
      default: return '⚪';
    }
  };

  const getTypeColor = (type: Printer['type']) => {
    switch (type) {
      case 'Levity': return 'bg-purple-100 text-purple-800';
      case 'Print as a Service': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {printer.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(printer.type)}`}>
                {printer.type}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(printer.status)}`}>
                <span className="mr-1">{getStatusIcon(printer.status)}</span>
                {printer.status}
              </span>
            </div>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onStatusChange('online');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Set Online
                  </button>
                  <button
                    onClick={() => {
                      onStatusChange('offline');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Set Offline
                  </button>
                  <button
                    onClick={() => {
                      onStatusChange('maintenance');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Set Maintenance
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {printer.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {printer.description}
          </p>
        )}

        {/* Location */}
        {printer.location && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {printer.location}
          </div>
        )}

        {/* Capabilities */}
        {printer.capabilities && (
          <div className="space-y-3">
            {/* Build Volume */}
            {printer.capabilities.maxBuildVolume && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Build Volume
                </h4>
                <p className="text-sm text-gray-900 dark:text-white">
                  {printer.capabilities.maxBuildVolume.width} × {printer.capabilities.maxBuildVolume.height} × {printer.capabilities.maxBuildVolume.depth} mm
                </p>
              </div>
            )}

            {/* Supported Materials */}
            {printer.capabilities.supportedMaterials && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Materials
                </h4>
                <div className="flex flex-wrap gap-1">
                  {printer.capabilities.supportedMaterials.map((material) => (
                    <span
                      key={material}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Layer Height Range */}
            {printer.capabilities.layerHeightRange && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Layer Height
                </h4>
                <p className="text-sm text-gray-900 dark:text-white">
                  {printer.capabilities.layerHeightRange.min} - {printer.capabilities.layerHeightRange.max} mm
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Added {printer.createdAt.toLocaleDateString()}</span>
            <span>Updated {printer.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterCard; 