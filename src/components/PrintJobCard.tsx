'use client';

import { FC, useState } from 'react';
import { PrintJob, Printer } from '@/types/models';

interface PrintJobCardProps {
  job: PrintJob;
  printer?: Printer;
  onStatusChange: (status: PrintJob['status']) => void;
}

const PrintJobCard: FC<PrintJobCardProps> = ({ job, printer, onStatusChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusColor = (status: PrintJob['status']) => {
    switch (status) {
      case 'queued': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'printing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: PrintJob['status']) => {
    switch (status) {
      case 'queued': return '⏳';
      case 'preparing': return '🔧';
      case 'printing': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'cancelled': return '🚫';
      default: return '⚪';
    }
  };

  const getPriorityColor = (priority: PrintJob['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTimeRemaining = () => {
    if (!job.estimatedDuration || !job.actualDuration || !job.progress) return null;
    const elapsed = job.actualDuration;
    const total = job.estimatedDuration;
    const remaining = total - elapsed;
    return remaining > 0 ? remaining : 0;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Print Job #{job.id}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                <span className="mr-1">{getStatusIcon(job.status)}</span>
                {job.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                {job.priority}
              </span>
            </div>
            
            {printer && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Printer: <span className="font-medium">{printer.name}</span>
                {printer.location && (
                  <span className="ml-2 text-gray-500">({printer.location})</span>
                )}
              </p>
            )}
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
                  {job.status === 'queued' && (
                    <button
                      onClick={() => {
                        onStatusChange('preparing');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Start Preparation
                    </button>
                  )}
                  {job.status === 'preparing' && (
                    <button
                      onClick={() => {
                        onStatusChange('printing');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Start Printing
                    </button>
                  )}
                  {['queued', 'preparing', 'printing'].includes(job.status) && (
                    <button
                      onClick={() => {
                        onStatusChange('cancelled');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Cancel Job
                    </button>
                  )}
                  {job.status === 'printing' && (
                    <button
                      onClick={() => {
                        onStatusChange('completed');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {job.status === 'printing' && job.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {job.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Print Settings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Material
            </h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {job.printSettings.material}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Layer Height
            </h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {job.printSettings.layerHeight} mm
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Infill
            </h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {job.printSettings.infill}%
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Support
            </h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {job.printSettings.support ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Timing Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Estimated
            </h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDuration(job.estimatedDuration)}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Elapsed
            </h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDuration(job.actualDuration)}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Remaining
            </h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDuration(getTimeRemaining())}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Started
            </h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {job.startedAt ? job.startedAt.toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Notes */}
        {job.notes && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Notes
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {job.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span>Created {job.createdAt.toLocaleDateString()}</span>
          <span>Updated {job.updatedAt.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PrintJobCard; 