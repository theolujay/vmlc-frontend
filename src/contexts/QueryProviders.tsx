"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
// const queryClient = new QueryClient();



// declare global {
//   interface Window {
//     __TANSTACK_QUERY_CLIENT__:
//     import("@tanstack/query-core").QueryClient;
//   }
// }

// This code is for all users

export default function QueryProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());

  // useEffect(() => {
  //   window.__TANSTACK_QUERY_CLIENT__ = queryClient;

  // }, [])
  return <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
}