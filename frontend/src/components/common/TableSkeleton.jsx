import React from 'react';
import Skeleton from './Skeleton';

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50/50">
          <tr>
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="px-6 py-3">
                <Skeleton height="1rem" width="60%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {colIndex === 0 && (
                      <Skeleton circle width="2.5rem" height="2.5rem" className="mr-4 shrink-0" />
                    )}
                    <Skeleton height="1rem" width={colIndex === 0 ? "100px" : "80%"} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
