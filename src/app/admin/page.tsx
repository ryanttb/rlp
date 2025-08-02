'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { seedDatabase, clearDatabase, checkDatabaseStatus } from '@/lib/databaseSeeder';

const AdminPage: FC = () => {
  const [dbStatus, setDbStatus] = useState<{
    categories: number;
    models: number;
    hasData: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadDbStatus();
  }, []);

  const loadDbStatus = async () => {
    try {
      const status = await checkDatabaseStatus();
      setDbStatus(status);
    } catch (error) {
      console.error('Error loading database status:', error);
      setMessage({ type: 'error', text: 'Failed to load database status' });
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm('This will add sample categories and models to the database. Continue?')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await seedDatabase();
      setMessage({ type: 'success', text: 'Database seeded successfully!' });
      await loadDbStatus();
    } catch (error) {
      console.error('Error seeding database:', error);
      setMessage({ type: 'error', text: 'Failed to seed database' });
    } finally {
      setLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm('This will delete ALL categories and models from the database. This action cannot be undone. Continue?')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await clearDatabase();
      setMessage({ type: 'success', text: 'Database cleared successfully!' });
      await loadDbStatus();
    } catch (error) {
      console.error('Error clearing database:', error);
      setMessage({ type: 'error', text: 'Failed to clear database' });
    } finally {
      setLoading(false);
    }
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
              <Link href="/models" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                3D Models
              </Link>
              <Link href="/admin" className="text-blue-600 dark:text-blue-400 font-semibold">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Database Administration
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your database and seed sample data for testing.
          </p>
        </div>

        {/* Database Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Database Status
          </h3>
          
          {dbStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Categories</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {dbStatus.categories}
                  </span>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 dark:text-green-300 font-medium">Models</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {dbStatus.models}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading database status...</p>
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seed Database */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Seed Database
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Add sample categories and models to the database for testing and demonstration purposes.
            </p>
            <button
              onClick={handleSeedDatabase}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Seeding...' : 'Seed Database'}
            </button>
          </div>

          {/* Clear Database */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Clear Database
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Remove all categories and models from the database. This action cannot be undone.
            </p>
            <button
              onClick={handleClearDatabase}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Clearing...' : 'Clear Database'}
            </button>
          </div>
        </div>

        {/* Sample Data Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sample Data Information
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Categories:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Mechanical Parts - Gears, bearings, brackets</li>
                <li>• Art & Sculptures - Decorative items, figurines</li>
                <li>• Household Items - Everyday objects, organizers</li>
                <li>• Tools & Equipment - Custom tools, jigs</li>
                <li>• Prototypes - Product prototypes</li>
                <li>• Educational - Learning models, teaching aids</li>
                <li>• Replacement Parts - Spare parts</li>
                <li>• Custom Designs - Personalized objects</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sample Models:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Gear Assembly (STL, 2MB) - Mechanical Parts</li>
                <li>• Artistic Vase (OBJ, 1MB) - Art & Sculptures</li>
                <li>• Phone Stand (STL, 500KB) - Household Items</li>
                <li>• Custom Wrench (STL, 1.5MB) - Tools & Equipment</li>
                <li>• DNA Model (3MF, 3MB) - Educational</li>
                <li>• Bracket Prototype (STL, 750KB) - Prototypes</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage; 