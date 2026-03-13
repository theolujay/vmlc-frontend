"use client"
import React from 'react';
import FullLeagueLeaderboard from '@/components/Admin/Competition/FullLeagueLeaderboard';
import PageLayout from '@/components/General/Layout/PageLayout';
import withAuthentication from '@/hocs/withAuthentication';
import { useRouter } from 'next/navigation';

function LeaderboardPage() {
  const router = useRouter();
  
  return (
    <PageLayout>
        <div className="mb-6">
            <FullLeagueLeaderboard onBack={() => router.push('/exam-portal')} />
        </div>
    </PageLayout>
  );
}

export default withAuthentication(LeaderboardPage);
