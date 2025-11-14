/**
 * 읽기 시간 계산 유틸리티
 * 평균 읽기 속도: 200-250 words per minute (한국어 기준 약간 낮게 설정)
 */
const WORDS_PER_MINUTE = 200;

export const calculateReadingTime = (text: string): number => {
  // 한글, 영문, 숫자 단어 개수 계산
  const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
  const minutes = Math.ceil(words.length / WORDS_PER_MINUTE);
  return Math.max(1, minutes); // 최소 1분
};

