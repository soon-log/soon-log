type CodeMeta = {
  language: string;
  highlightLines: number[];
};

/**
 * 코드 블록의 언어와 하이라이트 라인 번호를 파싱하는 헬퍼 함수
 * @param metaString - className으로 전달되는 문자열
 * @returns 언어와 하이라이트 라인 번호 배열을 포함하는 객체
 */
export function parseCodeMeta(metaString: string): CodeMeta {
  // 정규식을 사용하여 언어와 하이라이트 정보를 추출한다.
  const [, language = 'text', highlightSpec] =
    metaString.match(/language-(\w+)(?:{([\d,-]+)})?/) || [];

  if (!highlightSpec) {
    return { language, highlightLines: [] };
  }

  const highlightLines = highlightSpec.split(',').flatMap((part) => {
    const updatePart = part.trim();

    if (updatePart.includes('-')) {
      const [start, end] = updatePart.split('-').map(Number);

      if (start === undefined || end === undefined) return [];
      if (Number.isNaN(start) || Number.isNaN(end)) return [];
      if (start > end) return [];

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    const num = Number(updatePart);

    return Number.isNaN(num) ? [] : [num];
  });

  return { language, highlightLines };
}
