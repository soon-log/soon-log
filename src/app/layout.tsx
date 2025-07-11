import { StagewiseToolbar } from '@stagewise/toolbar-next';
import ReactPlugin from '@stagewise-plugins/react';
import type { Metadata } from 'next';
import { Nanum_Myeongjo, Noto_Sans_KR } from 'next/font/google';

import './globals.css';

const nanumMyeongjo = Nanum_Myeongjo({
  weight: '800',
  display: 'swap',
  variable: '--font-nanum-myeongjo',
  subsets: ['latin']
});

const notoSansKR = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  weight: ['100', '400', '500', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Soon Log',
  description: '처절한 개발 기록'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${nanumMyeongjo.variable} ${notoSansKR.variable} antialiased`}>
        {children}
        <StagewiseToolbar
          config={{
            plugins: [ReactPlugin]
          }}
        />
      </body>
    </html>
  );
}
