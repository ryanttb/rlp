'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showActions?: boolean;
  actions?: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ 
  title = "Rapid Liquid Printing", 
  subtitle,
  showActions = false,
  actions 
}) => {
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <Link href="/" className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RLP</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-300">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/" 
                className={`transition-colors ${
                  isActiveLink('/') 
                    ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/models" 
                className={`transition-colors ${
                  isActiveLink('/models') 
                    ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                3D Models
              </Link>
              <Link 
                href="/queue" 
                className={`transition-colors ${
                  isActiveLink('/queue') 
                    ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Print Queue
              </Link>
              <Link 
                href="/workflows" 
                className={`transition-colors ${
                  isActiveLink('/workflows') 
                    ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Workflows
              </Link>
            </nav>
            
            {showActions && actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 