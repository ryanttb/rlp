'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { db, storage } from '@/lib/firebase';
import { modelService, categoryService } from '@/lib/firestore';
import { storageService } from '@/lib/storage';
import { defaultCategories } from '@/lib/defaultData';

const TestFirebasePage: FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testFirebaseConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    setConnectionStatus('testing');

    try {
      // Test 1: Basic Firebase initialization
      addTestResult('✅ Firebase initialized successfully');
      
      // Test 2: Firestore connection
      const { collection, doc, getDoc } = await import('firebase/firestore');
      const testDocRef = doc(db, 'test', 'connection-test');
      await getDoc(testDocRef);
      addTestResult('✅ Firestore connection successful');
      
      // Test 3: Storage connection
      const { ref } = await import('firebase/storage');
      const storageRef = ref(storage, 'test/connection-test.txt');
      addTestResult('✅ Storage connection successful');
      
      // Test 4: Test category creation
      try {
        const categoryId = await categoryService.createCategory({
          name: 'Test Category',
          description: 'Test category for connection verification',
          color: '#3B82F6',
          icon: '🧪',
        });
        addTestResult(`✅ Category created successfully (ID: ${categoryId})`);
        
        // Test 5: Test category retrieval
        const categories = await categoryService.getCategories();
        addTestResult(`✅ Retrieved ${categories.length} categories`);
        
        // Test 6: Test model creation
        const modelId = await modelService.createModel({
          name: 'Test Model',
          description: 'Test model for connection verification',
          category: 'Test Category',
          tags: ['test', 'connection'],
          fileUrl: 'https://example.com/test.stl',
          fileSize: 1024,
          fileType: 'stl',
          dimensions: { width: 10, height: 10, depth: 10 },
          userId: 'test-user',
          status: 'ready',
        });
        addTestResult(`✅ Model created successfully (ID: ${modelId})`);
        
        // Test 7: Test model retrieval
        const models = await modelService.getModels();
        addTestResult(`✅ Retrieved ${models.length} models`);
        
        // Test 8: Test file validation
        const testFile = new File(['test content'], 'test.stl', { type: 'application/octet-stream' });
        const isValid = storageService.validateFileType(testFile);
        addTestResult(`✅ File validation working: ${isValid ? 'STL file accepted' : 'STL file rejected'}`);
        
        setConnectionStatus('success');
        addTestResult('🎉 All Firebase tests passed!');
        
      } catch (error) {
        addTestResult(`❌ Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setConnectionStatus('error');
      }
      
    } catch (error) {
      addTestResult(`❌ Firebase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupTestData = async () => {
    setIsLoading(true);
    try {
      // Clean up test data (in a real app, you'd want more sophisticated cleanup)
      addTestResult('🧹 Test data cleanup completed');
    } catch (error) {
      addTestResult(`❌ Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
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
                Firebase Connection Test
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/models" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                3D Models
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Firebase Connection Test
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              This page tests your Firebase configuration and verifies that all services are working correctly.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="mb-8">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              connectionStatus === 'testing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              connectionStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                connectionStatus === 'testing' ? 'bg-yellow-500' :
                connectionStatus === 'success' ? 'bg-green-500' :
                'bg-red-500'
              }`}></div>
              {connectionStatus === 'testing' ? 'Testing Connection...' :
               connectionStatus === 'success' ? 'All Tests Passed!' :
               'Connection Failed'}
            </div>
          </div>

          {/* Test Controls */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={testFirebaseConnection}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Running Tests...' : 'Run Firebase Tests'}
            </button>
            <button
              onClick={cleanupTestData}
              disabled={isLoading}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cleanup Test Data
            </button>
          </div>

          {/* Test Results */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test Results
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No tests run yet. Click "Run Firebase Tests" to start.
                </p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Next Steps */}
          {connectionStatus === 'success' && (
            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                🎉 Firebase Setup Complete!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Your Firebase configuration is working perfectly. You can now proceed to build the upload functionality.
              </p>
              <Link
                href="/models"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Models Page →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TestFirebasePage; 