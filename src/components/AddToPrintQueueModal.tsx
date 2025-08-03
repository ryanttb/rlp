'use client';

import { FC, useState, useEffect } from 'react';
import { Model, Printer, PrintJob } from '@/types/models';
import { printerService, printJobService } from '@/lib/firestore';

interface AddToPrintQueueModalProps {
  model: Model;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddToPrintQueueModal: FC<AddToPrintQueueModalProps> = ({ 
  model, 
  onClose, 
  onSuccess 
}) => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>('');
  const [priority, setPriority] = useState<PrintJob['priority']>('normal');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load available printers on component mount
  useEffect(() => {
    const loadPrinters = async () => {
      try {
        const availablePrinters = await printerService.getPrinters();
        // Filter to only show online printers
        const onlinePrinters = availablePrinters.filter(
          printer => printer.status === 'online' || printer.status === 'printing'
        );
        setPrinters(onlinePrinters);
        
        // Auto-select first available printer
        if (onlinePrinters.length > 0) {
          setSelectedPrinterId(onlinePrinters[0].id);
        }
      } catch (error) {
        console.error('Error loading printers:', error);
        setError('Failed to load available printers');
      }
    };

    loadPrinters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPrinterId) {
      setError('Please select a printer');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get default print settings from model or use defaults
      const defaultPrintSettings = model.printSettings || {
        layerHeight: 0.2,
        infill: 20,
        support: false,
        material: 'PLA',
        temperature: 200,
        bedTemperature: 60,
      };

      // Create the print job
      const printJobData: Omit<PrintJob, 'id' | 'createdAt' | 'updatedAt'> = {
        modelId: model.id,
        printerId: selectedPrinterId,
        status: 'queued',
        priority,
        userId: 'demo-user',
        printSettings: defaultPrintSettings,
        progress: 0,
        notes: notes.trim() || `Print job for ${model.name}`,
      };

      await printJobService.createPrintJob(printJobData);
      
      // Close modal and trigger success callback
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating print job:', error);
      setError('Failed to add model to print queue');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPrinter = printers.find(p => p.id === selectedPrinterId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add to Print Queue
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Model Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Model: {model.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {model.dimensions.width} × {model.dimensions.height} × {model.dimensions.depth} mm
            </p>
          </div>

          {/* Printer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Printer
            </label>
            <select
              value={selectedPrinterId}
              onChange={(e) => setSelectedPrinterId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a printer...</option>
              {printers.map((printer) => (
                <option key={printer.id} value={printer.id}>
                  {printer.name} ({printer.type}) - {printer.status}
                </option>
              ))}
            </select>
            {selectedPrinter && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {selectedPrinter.description || 'No description available'}
              </p>
            )}
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PrintJob['priority'])}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or special instructions for this print job..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedPrinterId}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Adding...' : 'Print'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToPrintQueueModal; 