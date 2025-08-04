import Header from '@/components/Header';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Advanced Analytics</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Gain comprehensive insights into print performance and production efficiency.
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8">
          <p className="text-gray-500 dark:text-gray-400">Analytics features coming soon!</p>
        </div>
      </main>
    </div>
  );
}