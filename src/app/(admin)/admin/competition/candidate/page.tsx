'use client';

import React, { Suspense } from 'react';
import ViewCandidateDetails from '@/components/Admin/Leaderboard/ViewCandidateDetails';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useRouter, useSearchParams } from 'next/navigation';

const CandidateDetailsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidate_id = searchParams.get('id') || '';
  const exam_id = searchParams.get('examId') || undefined;
  const isLeagueCumulative = searchParams.get('isLeagueCumulative') === 'true';

  if (!candidate_id) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Candidate Selected</h2>
        <p className="text-gray-600 mb-6">Please go back and select a candidate to view details.</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-[#3E4095] text-white rounded-full font-bold hover:bg-[#2d2f6e] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <ViewCandidateDetails
      candidate_id={candidate_id}
      exam_id={exam_id}
      isLeagueCumulative={isLeagueCumulative}
      onBack={() => router.back()}
    />
  );
};

const CandidateDetailsPage = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095] mx-auto mt-20"></div>}>
          <CandidateDetailsContent />
        </Suspense>
      </div>
    </AdminLayout>
  );
};

export default CandidateDetailsPage;
