"use client"
import React from 'react';
import PageLayout from '@/components/General/Layout/PageLayout';
import withAuthentication from '@/hocs/withAuthentication';
import { useParams, useRouter } from 'next/navigation';
import FullRanking from '@/components/Admin/Competition/FullRanking';
import useGetAccountMgt from '@/hooks/useGetAccountMgt';
import Spinner from '@/components/ui/spinner/spinner';

function RankingPage() {
    const { data: accountMgt, isPending } = useGetAccountMgt();
    const userRole = accountMgt?.role;
//   const isCandidate = authState?.profile?.profile_type === "candidate"
//   const isVolunteer = userRole === 'volunteer';
  const isModeratorOrAbove = ['moderator', 'admin', 'manager', 'superadmin'].includes(userRole || '');

  const params = useParams();
  const router = useRouter();
  const examId = params?.examId as string;

  if (isPending) return <div className="grid w-full h-screen place-content-center"><Spinner /></div>;

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