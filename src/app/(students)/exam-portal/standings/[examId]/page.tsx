"use client"
import React from 'react';
import PageLayout from '@/components/General/Layout/PageLayout';
import withAuthentication from '@/hocs/withAuthentication';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import FullStandings from '@/components/Admin/Competition/FullStandings';

function StandingsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.examId as string;

  return (
    <PageLayout>
        <div className="mb-6 max-w-6xl mx-auto w-full">
             <Link href="/exam-portal" className="text-slate-500 hover:text-slate-800 text-sm flex items-center gap-1 mb-4 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
            </Link>
            <div className="bg-white rounded-[24px] shadow-sm border border-[#E4E7EC] p-6 min-h-[60vh]">
                <FullStandings 
                    examId={examId} 
                    examTitle="" 
                    onBack={() => router.back()} 
                    isPublicView={true}
                />
            </div>
        </div>
    </PageLayout>
  );
}

export default withAuthentication(StandingsPage);
