export interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  openGraph: OpenGraphMetadata;
  twitter: TwitterMetadata;
  robots?: string;
}

export interface OpenGraphMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type: 'article' | 'website';
  siteName: string;
  locale: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export interface TwitterMetadata {
  card: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  image?: string;
  creator?: string;
  site?: string;
}

export interface BlogPostSEO {
  title: string;
  description: string;
  publishedDate: string;
  tags?: string[];
  category?: string;
  thumbnail?: string;
}
