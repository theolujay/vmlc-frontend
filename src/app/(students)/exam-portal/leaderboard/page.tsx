"use client"
import React from 'react';
import LeaderBoard from '@/components/General/Portal/LeaderBoard';
import PageLayout from '@/components/General/Layout/PageLayout';
import withAuthentication from '@/hocs/withAuthentication';
import Link from 'next/link';

function LeaderboardPage() {
  return (
    <PageLayout>
        <div className="mb-6">
             <Link href="/exam-portal" className="text-slate-500 hover:text-slate-800 text-sm flex items-center gap-1 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
            </Link>
            <LeaderBoard />
        </div>
    </PageLayout>
  );
}

export default withAuthentication(LeaderboardPage);
