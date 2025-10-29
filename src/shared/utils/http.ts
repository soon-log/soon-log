const envBase = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * 환경변수에 설정된 기본 URL 또는 로컬 환경의 기본 URL을 반환합니다.
 * @returns URL
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  if (envBase.startsWith('http://') || envBase.startsWith('https://')) {
    return envBase;
  }

  return `http://${envBase}`;
}

/**
 * 기본 URL과 경로를 조합하여 절대 URL을 반환합니다.
 * @param path 경로
 * @returns 절대 URL
 */
export function buildAbsoluteUrl(path: string): string {
  const base = getBaseUrl();
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
