"use client"
import React from 'react';
import PageLayout from '@/components/General/Layout/PageLayout';
import withAuthentication from '@/hocs/withAuthentication';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import FullRanking from '@/components/Admin/Competition/FullRanking';
import { useAuth } from '@/contexts/AuthProvider';

function RankingPage() {
  const { authState } = useAuth();
  const userRole = authState?.user?.role;
//   const isCandidate = authState?.profile?.profile_type === "candidate"
//   const isVolunteer = userRole === 'volunteer';
  const isModeratorOrAbove = ['moderator', 'admin', 'manager', 'superadmin'].includes(userRole || '');

  const params = useParams();
  const router = useRouter();
  const examId = params?.examId as string;

  return (
    <PageLayout>
        <div className="w-full">
            <FullRanking
                examId={examId}
                examTitle=""
                onBack={() => router.back()}
                isPublicView={!isModeratorOrAbove}
            />
        </div>
    </PageLayout>
  );
}

export default withAuthentication(RankingPage);