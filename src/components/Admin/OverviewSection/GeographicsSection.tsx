'use client';

import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { GeographicData } from '@/types/UserMgtType';

interface GeographicsSectionProps {
  data?: GeographicData[];
  title?: string;
  subtitle?: string;
}

export default function GeographicsSection({ data, title = 'Geographic Distribution', subtitle = 'Distribution of users by state' }: GeographicsSectionProps) {
  const maxCount = data && data.length > 0 ? Math.max(...data.map(d => d.count)) : 0;

  return (
    <ResponsiveContainer className="flex w-full gap-3 sm:gap-4 p-4 sm:p-6 flex-col mx-auto h-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-4 mt-2 flex-grow">
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{item.state}</span>
                <span className="font-bold text-gray-900">{item.count.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3E4095] transition-all duration-700 ease-out" 
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full min-h-[100px] text-gray-400 text-sm italic">
            No geographic data available for candidates.
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
}
