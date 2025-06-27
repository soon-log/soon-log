import { parseCodeMeta } from './code';

describe('parseCodeMeta 함수', () => {
  describe('정상 케이스', () => {
    test('기본 언어만 있는 경우', () => {
      // Given
      const metaString = 'language-javascript';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'javascript',
        highlightLines: []
      });
    });

    test('언어와 단일 하이라이트 라인', () => {
      // Given
      const metaString = 'language-typescript{5}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'typescript',
        highlightLines: [5]
      });
    });

    test('언어와 복수 개별 하이라이트 라인', () => {
      // Given
      const metaString = 'language-python{1,3,5}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'python',
        highlightLines: [1, 3, 5]
      });
    });

    test('언어와 범위 하이라이트 라인', () => {
      // Given
      const metaString = 'language-java{2-5}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'java',
        highlightLines: [2, 3, 4, 5]
      });
    });

    test('언어와 복합 하이라이트 라인', () => {
      // Given
      const metaString = 'language-rust{1,3-5,8}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'rust',
        highlightLines: [1, 3, 4, 5, 8]
      });
    });

    test('단일 숫자 범위', () => {
      // Given
      const metaString = 'language-go{3-3}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'go',
        highlightLines: [3]
      });
    });
  });

  describe('엣지 케이스', () => {
    test('빈 문자열', () => {
      // Given
      const metaString = '';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'text',
        highlightLines: []
      });
    });

    test('언어만 있고 하이라이트 정보가 빈 경우', () => {
      // Given
      const metaString = 'language-css{}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'css',
        highlightLines: []
      });
    });

    test('0 이하의 라인 번호 필터링', () => {
      // Given
      const metaString = 'language-js{0,1,-1,2}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'js',
        highlightLines: [1, 2]
      });
    });

    test('잘못된 범위 (시작이 끝보다 큰 경우)', () => {
      // Given
      const metaString = 'language-ts{5-2}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'ts',
        highlightLines: []
      });
    });

    test('범위에서 0 이하 값 필터링', () => {
      // Given
      const metaString = 'language-php{-1-2}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'php',
        highlightLines: []
      });
    });

    test('범위 끝이 0 이하인 경우', () => {
      // Given
      const metaString = 'language-ruby{1-0}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'ruby',
        highlightLines: []
      });
    });

    test('문자가 포함된 경우 정규식에서 매칭되지 않음', () => {
      // Given
      const metaString = 'language-php{a,b-c}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'php',
        highlightLines: []
      });
    });

    test('범위에서 시작이 NaN인 경우', () => {
      // Given
      const metaString = 'language-c{a-3}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'c',
        highlightLines: []
      });
    });

    test('범위에서 끝이 NaN인 경우', () => {
      // Given
      const metaString = 'language-cpp{1-b}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'cpp',
        highlightLines: []
      });
    });

    test('정규식 패턴에 맞지 않는 문자가 포함된 경우', () => {
      // Given
      const metaString = 'language-xml{1,abc,3}';

      // When
      const result = parseCodeMeta(metaString);

      // Then
      expect(result).toEqual({
        language: 'xml',
        highlightLines: []
      });
    });
  });
});
