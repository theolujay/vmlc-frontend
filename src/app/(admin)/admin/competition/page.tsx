'use client';

import React, { Suspense } from 'react';
import CompetitionWrapper from '@/components/Admin/Competition/CompetitionWrapper';
import AdminLayout from '@/components/Admin/AdminLayout';

const CompetitionPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095] mx-auto mt-20"></div>}>
          <CompetitionWrapper />
        </Suspense>
      </div>
    </AdminLayout>
  );
};

export default CompetitionPage;
