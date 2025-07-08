import { formatDateToKorean } from './date';

describe('formatDateToKorean', () => {
  test('YYYY-MM-DD 형식의 날짜를 한국어 형식으로 변환한다', () => {
    // Given: YYYY-MM-DD 형식의 날짜 문자열이 주어졌을 때
    const dateString = '2025-01-27';

    // When: formatDateToKorean 함수를 호출하면
    const result = formatDateToKorean(dateString);

    // Then: 한국어 형식으로 변환되어야 한다
    expect(result).toBe('2025년 1월 27일');
  });

  test('월과 일이 한 자리 수일 때 올바르게 처리한다', () => {
    // Given: 월과 일이 한 자리 수인 날짜가 주어졌을 때
    const dateString = '2025-03-05';

    // When: formatDateToKorean 함수를 호출하면
    const result = formatDateToKorean(dateString);

    // Then: 한 자리 수로 표시되어야 한다
    expect(result).toBe('2025년 3월 5일');
  });

  test('12월 31일을 올바르게 처리한다', () => {
    // Given: 연말 날짜가 주어졌을 때
    const dateString = '2024-12-31';

    // When: formatDateToKorean 함수를 호출하면
    const result = formatDateToKorean(dateString);

    // Then: 올바르게 변환되어야 한다
    expect(result).toBe('2024년 12월 31일');
  });

  test('1월 1일을 올바르게 처리한다', () => {
    // Given: 연초 날짜가 주어졌을 때
    const dateString = '2025-01-01';

    // When: formatDateToKorean 함수를 호출하면
    const result = formatDateToKorean(dateString);

    // Then: 올바르게 변환되어야 한다
    expect(result).toBe('2025년 1월 1일');
  });

  test('윤년의 2월 29일을 올바르게 처리한다', () => {
    // Given: 윤년의 2월 29일이 주어졌을 때
    const dateString = '2024-02-29';

    // When: formatDateToKorean 함수를 호출하면
    const result = formatDateToKorean(dateString);

    // Then: 올바르게 변환되어야 한다
    expect(result).toBe('2024년 2월 29일');
  });
});
