import Header from '@/components/Header';

export default function CloudPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Cloud-Deployed Platform</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Scalable, enterprise-ready architecture for modern 3D printing operations.
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8">
          <p className="text-gray-500 dark:text-gray-400">Cloud platform features coming soon!</p>
        </div>
      </main>
    </div>
  );
}