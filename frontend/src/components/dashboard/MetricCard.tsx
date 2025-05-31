import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const MetricCard = ({ title, value, icon, trend, color = 'primary' }: MetricCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className={`text-2xl font-bold mt-1 text-gray-800`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-2 flex items-center">
          <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-gray-500 text-sm ml-2">desde o mês passado</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
