'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { getQueryClient } from '@/shared/api';

const ReactQueryDevtools = lazy(() =>
  process.env.NODE_ENV === 'development'
    ? import('@tanstack/react-query-devtools').then((d) => ({
        default: d.ReactQueryDevtools,
      }))
    : Promise.resolve({ default: () => null }),
);

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Suspense fallback={null}>
        <ReactQueryDevtools />
      </Suspense>
    </QueryClientProvider>
  );
}
