import { FC } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center text-2xl mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      {description}
    </p>
  </div>
);

export default FeatureCard; 