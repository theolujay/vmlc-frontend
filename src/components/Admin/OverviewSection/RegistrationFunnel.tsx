'use client';

import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import useGetRegistrationTrends from '@/hooks/useGetRegistrationTrends';
import { FunnelData } from '@/types/UserMgtType';

interface RegistrationFunnelProps {
  preRegistered?: number;
  registered?: number;
  funnel?: FunnelData;
}

export default function RegistrationFunnel({ preRegistered: propPreRegistered, registered: propRegistered, funnel: propFunnel }: RegistrationFunnelProps) {
  const { data: trendData, isPending } = useGetRegistrationTrends(30);

  // Use props if provided, otherwise fallback to trend data funnel
  const preRegistered = propFunnel ? propFunnel.pre_registrations : (propPreRegistered !== undefined ? propPreRegistered : (trendData?.funnel?.pre_registrations ?? 0));
  const registered = propFunnel ? propFunnel.completed_registrations : (propRegistered !== undefined ? propRegistered : (trendData?.funnel?.completed_registrations ?? 0));
  
  const conversionRate = (propFunnel ? propFunnel.conversion_percentage : (propPreRegistered === undefined && trendData?.funnel 
    ? trendData.funnel.conversion_percentage 
    : (preRegistered > 0 ? (registered / preRegistered) * 100 : 0))) ?? 0;
  const dropOffRate = 100 - conversionRate;

  if (isPending && !propPreRegistered && !propFunnel) {
    return (
      <ResponsiveContainer className="flex w-full h-48 items-center justify-center mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3E4095]"></div>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer className="flex w-full gap-3 sm:gap-4 p-4 sm:p-6 flex-col mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg sm:text-xl font-bold">Pre-registration Funnel</h2>
          <p className="text-sm text-gray-600">Overview of candidate conversion from pre-registration to full registration</p>
        </div>
        <div className="bg-[#3E4095]/5 px-4 py-3 rounded-xl border border-[#3E4095]/10 flex flex-col items-end">
          <span className="text-xs font-semibold text-[#3E4095] uppercase tracking-wider">Conversion Rate</span>
          <p className="text-2xl font-bold text-[#3E4095]">{conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recorded interests</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{preRegistered.toLocaleString()}</span>
        </div>
        
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-[#0F973D]/10 bg-[#0F973D]/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0F973D]"></div>
            <span className="text-xs font-bold text-[#0F973D] uppercase tracking-wider">Converted to full registration</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{registered.toLocaleString()}</span>
        </div>
      </div>

      <div className="w-full mt-4 flex flex-col gap-2">
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Drop-off: {dropOffRate.toFixed(1)}%</span>
          <span>Conversion: {conversionRate.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-[#3E4095] transition-all duration-700 ease-out" 
            style={{ width: `${conversionRate}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-[11px] text-gray-500 italic">
            {preRegistered > 0 
              ? `${(preRegistered - registered).toLocaleString()} users pre-registered but did not complete registration.`
              : 'No registration data available yet.'}
          </p>
        </div>
      </div>
    </ResponsiveContainer>
  );
}
