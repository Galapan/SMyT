import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Skeleton from '../common/Skeleton';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, loading = false }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        {loading ? (
          <Skeleton width="3rem" height="3rem" className="rounded-lg" />
        ) : (
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
        )}
        {trend && !loading && (
          <div className={`flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
            {trendValue}
          </div>
        )}
        {loading && (
          <Skeleton width="4rem" height="1.25rem" className="rounded-full" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        {loading ? (
          <Skeleton width="40%" height="2rem" className="rounded" />
        ) : (
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        )}
      </div>
    </div>
  );
};


export default StatCard;
