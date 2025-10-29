import type { Metadata } from 'next';

import { GlobalProviders, metadataConfig, nanumMyeongjo, notoSansKR } from '@/app';

import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';

export const metadata: Metadata = metadataConfig;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="no-transition">
      <body className={`${nanumMyeongjo.variable} ${notoSansKR.variable} antialiased`}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
