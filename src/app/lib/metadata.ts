import { Metadata } from 'next';

export const metadataConfig: Metadata = {
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
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Soon Log'
      }
    ]
  }
};
