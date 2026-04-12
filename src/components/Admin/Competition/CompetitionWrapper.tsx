import React from 'react';
import CompetitionDashboard from './CompetitionDashboard';
import { useRouter } from 'next/navigation';
import useGetAccountMgt from '@/hooks/useGetAccountMgt';
import Spinner from '@/components/ui/spinner/spinner';

const CompetitionWrapper: React.FC = () => {
  const { data: accountMgt, isPending } = useGetAccountMgt();
  const router = useRouter();

  const userRole = accountMgt?.role;
  const isModeratorOrAbove = ['moderator', 'admin', 'manager', 'superadmin'].includes(userRole || '');

  const handleViewRanking = (id: string, title: string) => {
    if (!isModeratorOrAbove) return;
    router.push(`/admin/competition/ranking?id=${id}&title=${encodeURIComponent(title)}`);
  };

  const handleViewFullLeaderboard = () => {
    if (!isModeratorOrAbove) return;
    router.push('/admin/competition/leaderboard');
  };

  if (isPending) return <div className="grid w-full h-[60vh] place-content-center"><Spinner /></div>;

  return (
    <div className="w-full font-sans">
      <CompetitionDashboard
        onViewFullLeaderboard={isModeratorOrAbove ? handleViewFullLeaderboard : undefined}
        onViewFullRanking={isModeratorOrAbove ? (id, title) => handleViewRanking(id, title) : undefined}
        onViewRanking={isModeratorOrAbove ? handleViewRanking : undefined}
      />
    </div>
  );
};

export default CompetitionWrapper;
