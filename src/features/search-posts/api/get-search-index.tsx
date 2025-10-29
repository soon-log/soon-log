import lunr from 'lunr';

import { buildAbsoluteUrl } from '@/shared/utils';

import { LoadedSearchIndex, SearchIndexData } from '../model/types';

export async function fetchSearchIndex(): Promise<LoadedSearchIndex> {
  const response = await fetch(buildAbsoluteUrl('/data/lunr-index.json'));

  if (!response.ok) {
    throw new Error(`검색 인덱스 로드 실패: ${response.status}`);
  }

  const data: SearchIndexData = await response.json();

  return {
    index: lunr.Index.load(data.index),
    store: data.store
  };
}
