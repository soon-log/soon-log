import remarkGfm from 'remark-gfm';
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image-comic.pstatic.net'
      },
      {
        protocol: 'https',
        hostname: 'kr-a.kakaopagecdn.com'
      }
    ]
  }
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm]
  }
});

export default withMDX(nextConfig);
