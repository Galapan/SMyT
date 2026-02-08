import React from 'react';
import Skeleton from './Skeleton';

const StatsSkeleton = ({ cards = 4 }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cards} gap-4`}>
      {[...Array(cards)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <Skeleton width="3rem" height="3rem" className="rounded-lg shrink-0" />
            <div className="flex-1">
              <Skeleton width="40%" height="1.5rem" className="mb-2" />
              <Skeleton width="60%" height="0.875rem" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSkeleton;
