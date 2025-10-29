/**
 * YYYY-MM-DD 형식의 날짜 문자열을 한국어 형식으로 변환합니다.
 * @param dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns 한국어 형식의 날짜 문자열 (예: "2025년 1월 27일")
 */
export function formatDateToKorean(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}
