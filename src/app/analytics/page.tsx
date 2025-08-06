import { FC } from 'react';
import Header from '@/components/Header';

const AnalyticsPage: FC = () => {
  // Mock data for demonstration
  const mockData = {
    totalModels: 247,
    totalPrintJobs: 1234,
    activePrinters: 8,
    totalPrintTime: 847,
    successRate: 94.2,
    materialUsage: {
      PLA: 45.2,
      PETG: 28.7,
      ABS: 15.3,
      TPU: 10.8
    },
    monthlyStats: [
      { month: 'Jan', models: 12, jobs: 89, hours: 156 },
      { month: 'Feb', models: 18, jobs: 134, hours: 234 },
      { month: 'Mar', models: 25, jobs: 187, hours: 312 },
      { month: 'Apr', models: 31, jobs: 245, hours: 398 },
      { month: 'May', models: 28, jobs: 198, hours: 345 },
      { month: 'Jun', models: 35, jobs: 267, hours: 423 }
    ],
    topModels: [
      { name: 'Mechanical Gear Set', prints: 23, successRate: 96.2 },
      { name: 'Custom Phone Stand', prints: 18, successRate: 94.4 },
      { name: 'Articulated Dragon', prints: 15, successRate: 91.7 },
      { name: 'Tool Holder Bracket', prints: 12, successRate: 98.1 },
      { name: 'Miniature Terrain', prints: 10, successRate: 89.3 }
    ],
    printerUtilization: [
      { name: 'Prusa i3 MK3S+', utilization: 87, uptime: 98.5 },
      { name: 'Ender 3 Pro', utilization: 72, uptime: 94.2 },
      { name: 'Ultimaker S3', utilization: 91, uptime: 99.1 },
      { name: 'Creality CR-10', utilization: 65, uptime: 92.8 },
      { name: 'LulzBot TAZ 6', utilization: 78, uptime: 96.3 }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced Analytics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive insights into print performance, production efficiency, and operational metrics
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Models</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockData.totalModels.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <span className="text-2xl">🎨</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+12.5%</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Print Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockData.totalPrintJobs.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <span className="text-2xl">🖨️</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+8.3%</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockData.successRate}%</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+2.1%</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Print Hours</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockData.totalPrintTime}h</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <span className="text-2xl">⏱️</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+15.7%</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Material Usage */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Material Usage Distribution</h3>
            <div className="space-y-4">
              {Object.entries(mockData.materialUsage).map(([material, percentage]) => (
                <div key={material} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      material === 'PLA' ? 'bg-blue-500' :
                      material === 'PETG' ? 'bg-green-500' :
                      material === 'ABS' ? 'bg-red-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{material}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full ${
                          material === 'PLA' ? 'bg-blue-500' :
                          material === 'PETG' ? 'bg-green-500' :
                          material === 'ABS' ? 'bg-red-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Insight:</strong> PLA remains the most popular material due to its ease of use and wide compatibility. Consider expanding PETG offerings for improved strength applications.
              </p>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Monthly Growth Trends</h3>
            <div className="space-y-4">
              {mockData.monthlyStats.map((stat) => (
                <div key={stat.month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{stat.month}</span>
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Models</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{stat.models}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Jobs</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{stat.jobs}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Hours</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{stat.hours}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Trend:</strong> Consistent growth across all metrics indicates healthy platform adoption and increasing user engagement.
              </p>
            </div>
          </div>
        </div>

        {/* Top Performing Models */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Performing Models</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Model Name</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total Prints</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Performance</th>
                </tr>
              </thead>
              <tbody>
                {mockData.topModels.map((model, index) => (
                  <tr key={model.name} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">#{index + 1}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{model.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-900 dark:text-white font-medium">{model.prints}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        model.successRate >= 95 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        model.successRate >= 90 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {model.successRate}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              model.successRate >= 95 ? 'bg-green-500' :
                              model.successRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${model.successRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Printer Utilization */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Printer Utilization & Uptime</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockData.printerUtilization.map((printer) => (
              <div key={printer.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{printer.name}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Utilization</span>
                      <span className="text-gray-900 dark:text-white font-medium">{printer.utilization}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          printer.utilization >= 85 ? 'bg-green-500' :
                          printer.utilization >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${printer.utilization}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                      <span className="text-gray-900 dark:text-white font-medium">{printer.uptime}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          printer.uptime >= 98 ? 'bg-green-500' :
                          printer.uptime >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${printer.uptime}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Production Efficiency</h3>
            <ul className="space-y-2 text-blue-100">
              <li>• Average print success rate: 94.2%</li>
              <li>• Peak utilization hours: 2-6 PM</li>
              <li>• Most efficient material: PLA (96.8% success)</li>
              <li>• Average print time: 4.2 hours</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Operational Insights</h3>
            <ul className="space-y-2 text-green-100">
              <li>• 8 active printers with 87% avg utilization</li>
              <li>• 847 total print hours this month</li>
              <li>• 15.7% increase in print volume</li>
              <li>• 98.5% average printer uptime</li>
            </ul>
          </div>
        </div>

        {/* Analytics Features Overview */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Analytics Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Monitoring</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Live tracking of print jobs, printer status, and production metrics with instant alerts and notifications.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Performance Analysis</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Deep insights into print success rates, material efficiency, and optimization opportunities.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Predictive Analytics</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Machine learning-powered predictions for maintenance schedules, material requirements, and production planning.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;