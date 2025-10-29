import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ThemeInitializer, ThemeProvider } from '@/entities/theme';
import { NotFoundPage, LoadingPage } from '@/shared/components';
import { Header } from '@/widgets/header';

import { GA } from './ga';
import { ReactQueryProvider } from './react-query-provider';

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeInitializer />
      <ReactQueryProvider>
        <ErrorBoundary FallbackComponent={NotFoundPage}>
          <Suspense fallback={<LoadingPage />}>
            <ThemeProvider>
              <div className="container mx-auto flex h-full max-w-4xl flex-col">
                <Header />
                <Suspense fallback={<LoadingPage />}>
                  <main className="flex-1">{children}</main>
                </Suspense>
              </div>
            </ThemeProvider>
          </Suspense>
        </ErrorBoundary>
      </ReactQueryProvider>
      <GA />
    </>
  );
}
