import { FC } from 'react';
import Link from 'next/link';

const ModelsPage: FC = () => {
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
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            3D Model Gallery
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage and visualize your 3D models with interactive tools and real-time geometry analysis.
          </p>
        </div>

        {/* Gallery Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎨</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Gallery Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
              This is where you&apos;ll be able to browse, upload, and interact with 3D models. 
              Features will include real-time visualization, geometry analysis, and print preparation tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <span className="text-white text-sm">📁</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Models</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Support for STL, OBJ, and other 3D file formats
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <span className="text-white text-sm">👁️</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3D Viewer</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Interactive 3D visualization with rotation and zoom
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <span className="text-white text-sm">⚙️</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Analysis Tools</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Geometry validation and print preparation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelsPage; 