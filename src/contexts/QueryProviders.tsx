"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import useProfile from '@/hooks/useProfile';

function ProfileSync() {
  useProfile();
  return null;
}

export default function QueryProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ProfileSync />
      {children}
    </QueryClientProvider>
  );
}