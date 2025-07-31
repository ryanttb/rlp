import { FC } from 'react';
import Link from 'next/link';
import FeatureCard from '@/components/FeatureCard';
import TechBadge from '@/components/TechBadge';

const Home: FC = () => {
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
              <Link href="/queue" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Print Queue
              </Link>
              <Link href="/workflows" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Workflows
              </Link>
              <Link href="/test-firebase" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Test Firebase
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Next-Generation
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              3D Printing Platform
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Manage 3D models, monitor print jobs, and streamline production workflows with our cloud-deployed platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              Launch Dashboard
            </button>
            <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              View Documentation
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Link href="/models" className="block">
            <FeatureCard
              title="3D Model Gallery"
              description="Interactive visualization and management of 3D models with real-time geometry analysis."
              icon="🎨"
              color="from-purple-500 to-pink-500"
            />
          </Link>
          <FeatureCard
            title="Print Queue Management"
            description="Real-time monitoring and control of print jobs with live status updates."
            icon="🖨️"
            color="from-green-500 to-teal-500"
          />
          <FeatureCard
            title="Production Workflows"
            description="Streamlined processes for manufacturing operations and quality control."
            icon="⚙️"
            color="from-orange-500 to-red-500"
          />
          <FeatureCard
            title="Real-time Machine Interaction"
            description="Live communication with 3D printing systems for optimal performance."
            icon="🔗"
            color="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            title="Cloud-Deployed Platform"
            description="Scalable architecture designed for enterprise-level 3D printing operations."
            icon="☁️"
            color="from-indigo-500 to-purple-500"
          />
          <FeatureCard
            title="Advanced Analytics"
            description="Comprehensive insights into print performance and production efficiency."
            icon="📊"
            color="from-yellow-500 to-orange-500"
          />
        </div>

        {/* Tech Stack Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Built with Modern Technologies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TechBadge name="Next.js 15" color="bg-black text-white" />
            <TechBadge name="React 18" color="bg-blue-600 text-white" />
            <TechBadge name="TypeScript" color="bg-blue-700 text-white" />
            <TechBadge name="Tailwind CSS" color="bg-cyan-500 text-white" />
            <TechBadge name="Three.js" color="bg-green-600 text-white" />
            <TechBadge name="Firebase" color="bg-yellow-500 text-black" />
            <TechBadge name="Node.js" color="bg-green-700 text-white" />
            <TechBadge name="Vercel" color="bg-black text-white" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            Rapid Liquid Printing Platform - Built for the future of additive manufacturing
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
