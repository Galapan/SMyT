import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Skeleton from '../common/Skeleton';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, loading = false }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 transition-all hover:shadow-md flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {loading ? (
          <Skeleton width="3rem" height="3rem" className="rounded-lg shrink-0" />
        ) : (
          <div className={`p-3 rounded-lg shrink-0 ${color}`}>
            <Icon size={24} />
          </div>
        )}
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">{title}</p>
          {loading ? (
            <Skeleton width="4rem" height="1.75rem" className="rounded" />
          ) : (
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">{value}</h3>
          )}
        </div>
      </div>
      
      <div className="shrink-0 text-right">
        {loading ? (
           <Skeleton width="4rem" height="1.25rem" className="rounded-full inline-block" />
        ) : trend ? (
           <div className={`flex flex-col items-end text-xs font-medium ${
            trend === 'up' ? 'text-gob-verde' : 'text-gob-rosa'
          }`}>
             <span className="flex items-center">
               {trend === 'up' ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
               <span className="hidden sm:inline">Tendencia</span>
             </span>
             <span className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{trendValue}</span>
           </div>
        ) : null}
      </div>
    </div>
  );
};


export default StatCard;
