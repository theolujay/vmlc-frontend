'use client';

import React, { Suspense } from 'react';
import FullLeagueLeaderboard from '@/components/Admin/Competition/FullLeagueLeaderboard';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useRouter } from 'next/navigation';

const LeaderboardPage = () => {
  const router = useRouter();

  return (
    <AdminLayout>
      <div className="p-6">
        <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095] mx-auto mt-20"></div>}>
          <FullLeagueLeaderboard
            onBack={() => router.push('/admin/competition')}
          />
        </Suspense>
      </div>
    </AdminLayout>
  );
};

export default LeaderboardPage;
