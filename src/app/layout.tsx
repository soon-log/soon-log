import { StagewiseToolbar } from '@stagewise/toolbar-next';
import ReactPlugin from '@stagewise-plugins/react';
import type { Metadata } from 'next';

import { Header } from '@/components/header/header';
import { ThemeInitializer } from '@/components/theme/theme-initializer';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { nanumMyeongjo, notoSansKR } from '@/lib/fonts';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Soon Log',
    template: '%s | Soon Log'
  },
  description: '개발 지식과 경험을 공유하는 기술 블로그',
  keywords: ['개발', '프로그래밍', '기술 블로그', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Soon Log' }],
  creator: 'Soon Log',
  publisher: 'Soon Log',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'Soon Log',
    description: '개발 지식과 경험을 공유하는 기술 블로그',
    siteName: 'Soon Log',
    images: [
      {
        url: '/default-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Soon Log'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soon Log',
    description: '개발 지식과 경험을 공유하는 기술 블로그',
    images: ['/default-og-image.jpg']
  },
  alternates: {
    canonical: '/'
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="no-transition">
      <head>
        <ThemeInitializer />
      </head>
      <body className={`${nanumMyeongjo.variable} ${notoSansKR.variable} antialiased`}>
        <ThemeProvider>
          <div className="container mx-auto px-4">
            <Header />
            {children}
          </div>
          <StagewiseToolbar
            config={{
              plugins: [ReactPlugin]
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
