import { GoogleAnalytics } from '@next/third-parties/google';

export function GA() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  if (!gaId) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
