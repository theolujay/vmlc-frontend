'use client';

import React, { Suspense } from 'react';
import FullRanking from '@/components/Admin/Competition/FullRanking';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useRouter, useSearchParams } from 'next/navigation';

const RankingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get('id') || '';
  const examTitle = searchParams.get('title') || 'Exam Ranking';

  if (!examId) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Exam Selected</h2>
        <p className="text-gray-600 mb-6">Please go back and select an exam to view its ranking.</p>
        <button
          onClick={() => router.push('/admin/competition')}
          className="px-6 py-2 bg-[#3E4095] text-white rounded-full font-bold hover:bg-[#2d2f6e] transition-colors"
        >
          Back to Competition
        </button>
      </div>
    );
  }

  return (
    <FullRanking
      onBack={() => router.push('/admin/competition')}
      examId={examId}
      examTitle={examTitle}
    />
  );
};

const RankingPage = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095] mx-auto mt-20"></div>}>
          <RankingContent />
        </Suspense>
      </div>
    </AdminLayout>
  );
};

export default RankingPage;
