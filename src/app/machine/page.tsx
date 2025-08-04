import Header from '@/components/Header';

export default function MachinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Real-time Machine Interaction</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Communicate live with 3D printing systems for optimal performance and monitoring.
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8">
          <p className="text-gray-500 dark:text-gray-400">Machine interaction features coming soon!</p>
        </div>
      </main>
    </div>
  );
}