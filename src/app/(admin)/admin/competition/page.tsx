'use client';

import React from 'react';
import CompetitionDashboard from '@/components/Admin/Competition/CompetitionDashboard';
import AdminLayout from '@/components/Admin/AdminLayout';

const CompetitionPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <CompetitionDashboard />
      </div>
    </AdminLayout>
  );
};

export default CompetitionPage;
