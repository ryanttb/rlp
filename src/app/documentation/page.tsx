import { FC } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

const Documentation: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Platform Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Complete guide to the Rapid Liquid Printing platform
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Getting Started</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <a href="#overview" className="hover:text-blue-600 dark:hover:text-blue-400">Platform Overview</a></li>
                <li>• <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400">Core Features</a></li>
                <li>• <a href="#architecture" className="hover:text-blue-600 dark:hover:text-blue-400">Technical Architecture</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">User Guides</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <a href="#models" className="hover:text-blue-600 dark:hover:text-blue-400">3D Model Management</a></li>
                <li>• <a href="#printing" className="hover:text-blue-600 dark:hover:text-blue-400">Print Queue System</a></li>
                <li>• <a href="#workflows" className="hover:text-blue-600 dark:hover:text-blue-400">Production Workflows</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <section id="overview" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Platform Overview</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The Rapid Liquid Printing (RLP) platform is a comprehensive 3D printing management system designed for modern additive manufacturing operations. Built with cutting-edge web technologies, it provides a seamless interface for managing 3D models, monitoring print jobs, and optimizing production workflows.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our platform addresses the key challenges faced by 3D printing operations: model management, print job scheduling, real-time monitoring, and production optimization. Whether you&apos;re running a small workshop or a large-scale manufacturing facility, RLP provides the tools you need to streamline your operations.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Key Benefits</h4>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Centralized 3D model management with advanced visualization</li>
                <li>• Real-time print job monitoring and control</li>
                <li>• Scalable cloud architecture for enterprise operations</li>
                <li>• Intuitive user interface designed for efficiency</li>
                <li>• Comprehensive analytics and reporting capabilities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Core Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🎨 3D Model Gallery</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Advanced model management system with interactive 3D visualization powered by Three.js. Upload, organize, and preview your 3D models with real-time geometry analysis.
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                <li>• Drag-and-drop file upload with progress tracking</li>
                <li>• Interactive 3D model viewer with rotation and zoom</li>
                <li>• Advanced filtering and sorting capabilities</li>
                <li>• Metadata management and editing</li>
                <li>• Category and tag organization</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🖨️ Print Queue Management</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Real-time print job monitoring and control system. Track job progress, manage printer status, and optimize your production workflow.
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                <li>• Live status updates and progress tracking</li>
                <li>• Multi-printer management and load balancing</li>
                <li>• Priority-based job scheduling</li>
                <li>• Print settings customization</li>
                <li>• Error handling and recovery</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">⚙️ Production Workflows</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Streamlined processes for manufacturing operations, quality control, and production optimization.
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                <li>• Automated workflow orchestration</li>
                <li>• Quality control checkpoints</li>
                <li>• Production scheduling and optimization</li>
                <li>• Resource allocation management</li>
                <li>• Performance analytics and reporting</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📊 Advanced Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Comprehensive insights into print performance, production efficiency, and operational metrics.
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                <li>• Real-time performance monitoring</li>
                <li>• Production efficiency metrics</li>
                <li>• Cost analysis and optimization</li>
                <li>• Predictive maintenance alerts</li>
                <li>• Custom reporting and dashboards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section id="architecture" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Technical Architecture</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Built with modern web technologies and cloud-native architecture, RLP is designed for scalability, reliability, and performance.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Frontend Technologies</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">React & Next.js</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Modern React 18 with Next.js 15 for server-side rendering, routing, and optimized performance.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">TypeScript</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Full TypeScript implementation for type safety, better development experience, and reduced runtime errors.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Three.js</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Advanced 3D graphics library for interactive model visualization and real-time rendering.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tailwind CSS</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Utility-first CSS framework for rapid UI development and consistent design system.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Backend & Infrastructure</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Firebase Firestore</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  NoSQL cloud database for real-time data synchronization and scalable data storage.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Firebase Storage</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Cloud storage for 3D model files with automatic scaling and global CDN distribution.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Vercel Deployment</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Global edge deployment with automatic scaling, CDN, and zero-downtime deployments.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Features</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Live updates for print job status, printer monitoring, and collaborative features.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* User Guides */}
        <section id="models" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">3D Model Management</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Uploading Models</h3>
            <ol className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>1. Navigate to the <Link href="/models" className="text-blue-600 dark:text-blue-400 hover:underline">3D Models</Link> section</li>
              <li>2. Click the &quot;Upload Model&quot; button or drag files directly onto the upload area</li>
              <li>3. Supported formats: STL, OBJ, PLY, and other common 3D file formats</li>
              <li>4. Add metadata including name, description, category, and tags</li>
              <li>5. Review the 3D preview and confirm upload</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Managing Your Models</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>• Use the search and filter options to find specific models</li>
              <li>• Organize models by categories and tags for easy discovery</li>
              <li>• Edit model metadata at any time through the model detail view</li>
              <li>• Download models for local use or sharing</li>
              <li>• View detailed 3D previews with rotation and zoom controls</li>
            </ul>
          </div>
        </section>

        <section id="printing" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Print Queue System</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Adding Print Jobs</h3>
            <ol className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>1. From any model detail page, click &quot;Add to Print Queue&quot;</li>
              <li>2. Select an available printer from the dropdown</li>
              <li>3. Set priority level (Low, Normal, High, Urgent)</li>
              <li>4. Configure print settings or use defaults</li>
              <li>5. Add optional notes and confirm the job</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Monitoring Print Jobs</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>• Real-time status updates show current progress</li>
              <li>• Live printer status indicators (Online, Printing, Offline, Error)</li>
              <li>• Job queue management with drag-and-drop reordering</li>
              <li>• Detailed job history and completion statistics</li>
              <li>• Error handling and recovery procedures</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Printer Management</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Add new printers with specifications and capabilities</li>
              <li>• Monitor printer health and maintenance schedules</li>
              <li>• Configure print settings and material profiles</li>
              <li>• Set up automated alerts for printer issues</li>
            </ul>
          </div>
        </section>

        <section id="workflows" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Production Workflows</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The workflow system enables you to create automated production processes that streamline your 3D printing operations.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Creating Workflows</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>• Define sequential production steps</li>
              <li>• Set up quality control checkpoints</li>
              <li>• Configure automated notifications</li>
              <li>• Establish approval processes</li>
              <li>• Create reusable workflow templates</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Workflow Automation</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Automatic job scheduling based on workflow steps</li>
              <li>• Integration with quality control systems</li>
              <li>• Automated reporting and documentation</li>
              <li>• Resource allocation optimization</li>
            </ul>
          </div>
        </section>

        {/* Getting Started CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 opacity-90">
            Explore the platform and discover how RLP can transform your 3D printing operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/models" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Models
            </Link>
            <Link 
              href="/queue" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Print Queue
            </Link>
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

export default Documentation; 