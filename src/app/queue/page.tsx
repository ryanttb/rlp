'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { Printer, PrintJob, Model } from '@/types/models';
import { printerService, printJobService, modelService } from '@/lib/firestore';
import PrinterCard from '@/components/PrinterCard';
import PrintJobCard from '@/components/PrintJobCard';
import AddPrinterModal from '@/components/AddPrinterModal';

const QueuePage: FC = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isAddPrinterModalOpen, setIsAddPrinterModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'printers' | 'jobs'>('printers');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Mock data for fallback
  const mockPrinters: Printer[] = [
    {
      id: '1',
      name: 'Levity Pro X1',
      type: 'Levity',
      status: 'printing',
      location: 'Production Lab A',
      description: 'High-speed liquid printing system with advanced material handling',
      capabilities: {
        maxBuildVolume: { width: 300, height: 300, depth: 400 },
        supportedMaterials: ['PLA', 'ABS', 'PETG', 'TPU'],
        layerHeightRange: { min: 0.1, max: 0.3 }
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Service Printer Alpha',
      type: 'Print as a Service',
      status: 'online',
      location: 'Service Center B',
      description: 'Cloud-connected service printer for remote operations',
      capabilities: {
        maxBuildVolume: { width: 250, height: 250, depth: 300 },
        supportedMaterials: ['PLA', 'ABS', 'Resin'],
        layerHeightRange: { min: 0.05, max: 0.2 }
      },
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Levity Mini',
      type: 'Levity',
      status: 'maintenance',
      location: 'R&D Lab',
      description: 'Compact liquid printing system for prototyping',
      capabilities: {
        maxBuildVolume: { width: 150, height: 150, depth: 200 },
        supportedMaterials: ['PLA', 'Resin'],
        layerHeightRange: { min: 0.1, max: 0.25 }
      },
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date()
    }
  ];

  const mockPrintJobs: PrintJob[] = [
    {
      id: '1',
      modelId: 'model-1',
      printerId: '1',
      status: 'printing',
      priority: 'high',
      estimatedDuration: 180,
      actualDuration: 45,
      progress: 25,
      startedAt: new Date(Date.now() - 45 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      updatedAt: new Date(),
      userId: 'demo-user',
      printSettings: {
        layerHeight: 0.2,
        infill: 20,
        support: true,
        material: 'PLA',
        temperature: 200,
        bedTemperature: 60
      },
      notes: 'High priority prototype for client demo'
    },
    {
      id: '2',
      modelId: 'model-2',
      printerId: '2',
      status: 'queued',
      priority: 'normal',
      estimatedDuration: 120,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      updatedAt: new Date(),
      userId: 'demo-user',
      printSettings: {
        layerHeight: 0.15,
        infill: 15,
        support: false,
        material: 'ABS',
        temperature: 230,
        bedTemperature: 100
      }
    }
  ];

  // Load data from Firebase or fallback to mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to load from Firebase
        const [firebasePrinters, firebasePrintJobs, firebaseModels] = await Promise.all([
          printerService.getPrinters(),
          printJobService.getPrintJobs(),
          modelService.getModels()
        ]);

        // If Firebase has data, use it; otherwise use mock data
        if (firebasePrinters.length > 0 || firebasePrintJobs.length > 0) {
          setPrinters(firebasePrinters);
          setPrintJobs(firebasePrintJobs);
          setModels(firebaseModels);
          setUseMockData(false);
        } else {
          setPrinters(mockPrinters);
          setPrintJobs(mockPrintJobs);
          setModels([]); // No mock models needed for demo
          setUseMockData(true);
        }
      } catch (err) {
        console.error('Error loading data from Firebase:', err);
        setError('Failed to load data from Firebase. Using demo data.');
        setPrinters(mockPrinters);
        setPrintJobs(mockPrintJobs);
        setModels([]);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddPrinter = async (printer: Omit<Printer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (useMockData) {
        // Add to local state if using mock data
        const newPrinter: Printer = {
          ...printer,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setPrinters([...printers, newPrinter]);
      } else {
        // Add to Firebase
        const printerId = await printerService.createPrinter(printer);
        const newPrinter: Printer = {
          ...printer,
          id: printerId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setPrinters([...printers, newPrinter]);
      }
      setIsAddPrinterModalOpen(false);
    } catch (err) {
      console.error('Error adding printer:', err);
      setError('Failed to add printer. Please try again.');
    }
  };

  const handlePrinterStatusChange = async (printerId: string, status: Printer['status']) => {
    try {
      if (useMockData) {
        // Update local state if using mock data
        setPrinters(printers.map(p => 
          p.id === printerId ? { ...p, status, updatedAt: new Date() } : p
        ));
      } else {
        // Update in Firebase
        await printerService.updatePrinter(printerId, { status });
        setPrinters(printers.map(p => 
          p.id === printerId ? { ...p, status, updatedAt: new Date() } : p
        ));
      }
    } catch (err) {
      console.error('Error updating printer status:', err);
      setError('Failed to update printer status. Please try again.');
    }
  };

  const handlePrintJobStatusChange = async (jobId: string, status: PrintJob['status']) => {
    try {
      if (useMockData) {
        // Update local state if using mock data
        setPrintJobs(printJobs.map(j => 
          j.id === jobId ? { ...j, status, updatedAt: new Date() } : j
        ));
      } else {
        // Update in Firebase
        await printJobService.updatePrintJob(jobId, { status });
        setPrintJobs(printJobs.map(j => 
          j.id === jobId ? { ...j, status, updatedAt: new Date() } : j
        ));
      }
    } catch (err) {
      console.error('Error updating print job status:', err);
      setError('Failed to update print job status. Please try again.');
    }
  };

  // Helper function to find model by ID
  const getModelById = (modelId: string): Model | undefined => {
    return models.find(model => model.id === modelId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RLP</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">/</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Print Queue
              </h1>
            </div>
            <button
              onClick={() => setIsAddPrinterModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Printer
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Indicator */}
      {useMockData && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Demo Mode: Using sample data. Connect to Firebase to use real data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('printers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'printers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Printers ({printers.length})
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Print Jobs ({printJobs.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'printers' ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Available Printers
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor and manage your 3D printing systems
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {printers.map((printer) => (
                <PrinterCard
                  key={printer.id}
                  printer={printer}
                  onStatusChange={(status) => handlePrinterStatusChange(printer.id, status)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Print Jobs
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track the status and progress of your print jobs
              </p>
            </div>
            
            <div className="space-y-4">
              {printJobs.map((job) => (
                <PrintJobCard
                  key={job.id}
                  job={job}
                  printer={printers.find(p => p.id === job.printerId)}
                  model={getModelById(job.modelId)}
                  onStatusChange={(status) => handlePrintJobStatusChange(job.id, status)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Printer Modal */}
      <AddPrinterModal
        isOpen={isAddPrinterModalOpen}
        onClose={() => setIsAddPrinterModalOpen(false)}
        onAdd={handleAddPrinter}
      />
    </div>
  );
};

export default QueuePage; 