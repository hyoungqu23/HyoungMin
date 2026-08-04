/**
 * 제목 문자열을 기반으로 일관된 Editorial 팔레트 색상을 생성합니다.
 * 같은 제목은 항상 같은 색상을 반환합니다.
 */
export const generateThumbnailColor = (title: string): string => {
  // 제목 문자열을 해시하여 숫자로 변환
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 채도가 낮은 팔레트라 밝은 테마와 어두운 테마 모두에서 과하게 튀지 않는다.
  const colors = [
    "#E7E5E4", // Stone
    "#FDE68A", // Amber
    "#BFDBFE", // Blue
    "#C4B5FD", // Violet
    "#BBF7D0", // Green
    "#FECDD3", // Rose
    "#BAE6FD", // Sky
    "#FED7AA", // Orange
  ];

  // 해시 값을 사용하여 색상 선택
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex] ?? "#E7E5E4";
};

/**
 * 제목 텍스트 색상을 결정합니다 (배경색에 따라)
 */
export const getTextColor = (bgColor: string): string => {
  // 밝은 색상이면 어두운 텍스트, 어두운 색상이면 밝은 텍스트
  const match = bgColor.match(/^#?([0-9a-f]{6})$/i);
  if (!match) return "#18181B";

  const hex = match[1]!;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF";
};
