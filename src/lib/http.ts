export function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  const envBase = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  if (envBase.startsWith('http://') || envBase.startsWith('https://')) {
    return envBase;
  }
  return `http://${envBase}`;
}

export function buildAbsoluteUrl(path: string): string {
  const base = getBaseUrl();
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
