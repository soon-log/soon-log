import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Header } from '@/app/_components/header/header';
import { LoadingPage } from '@/components/loading-page';
import { FallbackPage } from '@/components/not-found-page';
import { ThemeInitializer } from '@/components/theme/theme-initializer';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { nanumMyeongjo, notoSansKR } from '@/lib/fonts';

import { GA } from './_components/ga';
import { ReactQueryProvider } from './_components/react-query-provider';

import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'Soon Log',
    template: '%s | Soon Log'
  },
  description: '개발 지식과 경험을 공유하는 기술 블로그',
  openGraph: {
    title: 'Soon Log',
    description: '개발 지식과 경험을 공유하는 기술 블로그',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    images: [
      {
        url: '/default-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Soon Log'
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="no-transition">
      <body className={`${nanumMyeongjo.variable} ${notoSansKR.variable} antialiased`}>
        <ThemeInitializer />
        <ReactQueryProvider>
          <ErrorBoundary FallbackComponent={FallbackPage}>
            <Suspense fallback={<LoadingPage />}>
              <ThemeProvider>
                <div className="container mx-auto flex h-full max-w-4xl flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                </div>
              </ThemeProvider>
            </Suspense>
          </ErrorBoundary>
        </ReactQueryProvider>
        <GA />
      </body>
    </html>
  );
}
