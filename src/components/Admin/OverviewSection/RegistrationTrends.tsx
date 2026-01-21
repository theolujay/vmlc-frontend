'use client';

import React, { useState } from 'react';
import ResponsiveContainer from '../../ui/ResponsiveContainer';
import LineChart from '../Charts/LineChart';
import useGetRegistrationTrends from '@/hooks/useGetRegistrationTrends';

export default function RegistrationTrends() {
  const [days, setDays] = useState(7);
  const { data, isPending } = useGetRegistrationTrends(days);

  const chartData = {
    labels: data?.daily?.candidates?.map((item) => {
        const dateString = item.day ?? item.date ?? '';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }) ?? [],
    datasets: [
      {
        label: 'Registrations',
        data: data?.daily?.candidates?.map((item) => item.count) ?? [],
        borderColor: '#3E4095',
        backgroundColor: 'rgba(62, 64, 149, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <ResponsiveContainer className="flex w-full gap-4 p-4 flex-col mx-auto mt-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Registration Trends</h2>
          <p className="text-sm text-gray-600">Overview of candidate registrations over time</p>
        </div>
        <div className="flex border rounded-lg overflow-hidden bg-gray-50">
          <button
            onClick={() => setDays(7)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              days === 7
                ? 'bg-white text-[#3E4095] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setDays(30)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              days === 30
                ? 'bg-white text-[#3E4095] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Last 30 days
          </button>
        </div>
      </div>

      <div className="relative w-full h-[300px] mt-2">
        {isPending ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3E4095]"></div>
          </div>
        ) : null}
        <LineChart data={chartData} />
      </div>
    </ResponsiveContainer>
  );
}
