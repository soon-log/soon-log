import { Nanum_Myeongjo } from 'next/font/google';
import { Noto_Sans_KR } from 'next/font/google';

export const nanumMyeongjo = Nanum_Myeongjo({
  weight: '800',
  display: 'swap',
  variable: '--font-nanum-myeongjo',
  subsets: ['latin']
});

export const notoSansKR = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  weight: ['100', '400', '500', '700'],
  display: 'swap'
});
