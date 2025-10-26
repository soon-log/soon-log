import { promises as fs } from 'fs';

type JsonCacheEntry<T> = {
  value: T;
  mtimeMs: number | null;
};

const jsonCache = new Map<string, JsonCacheEntry<unknown>>();
const isDev = process.env.NODE_ENV !== 'production';

export async function readCachedJson<T>(filePath: string): Promise<T> {
  const cached = jsonCache.get(filePath) as JsonCacheEntry<T> | undefined;

  if (!isDev && cached) {
    return cached.value;
  }

  let currentMtime: number | null = null;

  if (isDev) {
    const stat = await fs.stat(filePath);
    currentMtime = stat.mtimeMs;
    if (cached && cached.mtimeMs === currentMtime) {
      return cached.value;
    }
  } else if (cached) {
    return cached.value;
  }

  const fileContent = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(fileContent) as T;

  jsonCache.set(filePath, { value: parsed, mtimeMs: currentMtime });

  return parsed;
}
