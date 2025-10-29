interface TagInfo {
  name: string;
  count: number;
}

export const getTagInfos = (tags: Array<string>): Array<TagInfo> => {
  const tagCounts = new Map<string, number>();
  for (const tag of tags) {
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }

  const tagInfos: Array<TagInfo> = Array.from(tagCounts).map(([name, count]) => ({
    name,
    count
  }));

  return tagInfos;
};

/**
 * 태그 정보 배열을 정렬하는 함수
 * @param tagInfos 태그 정보 배열
 * @param selectedTags 선택된 태그 배열
 * @returns 정렬된 태그 정보 배열
 */
export const sortTags = (tagInfos: Array<TagInfo>, selectedTags: Array<string>): Array<TagInfo> => {
  return tagInfos.sort((a, b) => {
    // selectedTags에 포함된 태그를 최우선으로 정렬
    const aSelected = selectedTags.includes(a.name);
    const bSelected = selectedTags.includes(b.name);

    if (aSelected && !bSelected) {
      return -1;
    }
    if (!aSelected && bSelected) {
      return 1;
    }

    // 둘 다 선택되었거나 둘 다 선택되지 않은 경우, 기존 정렬 로직 적용
    if (a.count !== b.count) {
      return b.count - a.count;
    }
    return a.name.localeCompare(b.name);
  });
};
