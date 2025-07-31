import { FC } from 'react';

interface TechBadgeProps {
  name: string;
  color: string;
}

const TechBadge: FC<TechBadgeProps> = ({ name, color }) => (
  <div className={`${color} px-4 py-2 rounded-lg text-center font-medium text-sm`}>
    {name}
  </div>
);

export default TechBadge; 