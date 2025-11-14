/**
 * 제목 문자열을 기반으로 일관된 색상을 생성합니다.
 * 같은 제목은 항상 같은 색상을 반환합니다.
 */
export const generateThumbnailColor = (title: string): string => {
  // 제목 문자열을 해시하여 숫자로 변환
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 색상 팔레트 (부드러운 그라데이션 색상들)
  const colors = [
    { bg: "#3B82F6", text: "#FFFFFF" }, // Blue
    { bg: "#8B5CF6", text: "#FFFFFF" }, // Purple
    { bg: "#EC4899", text: "#FFFFFF" }, // Pink
    { bg: "#F59E0B", text: "#FFFFFF" }, // Amber
    { bg: "#10B981", text: "#FFFFFF" }, // Emerald
    { bg: "#06B6D4", text: "#FFFFFF" }, // Cyan
    { bg: "#6366F1", text: "#FFFFFF" }, // Indigo
    { bg: "#EF4444", text: "#FFFFFF" }, // Red
    { bg: "#14B8A6", text: "#FFFFFF" }, // Teal
    { bg: "#F97316", text: "#FFFFFF" }, // Orange
  ];

  // 해시 값을 사용하여 색상 선택
  const colorIndex = Math.abs(hash) % colors.length;
  const selectedColor = colors[colorIndex];
  if (!selectedColor) {
    return colors[0]?.bg || "#3B82F6"; // 기본 색상
  }
  return selectedColor.bg;
};

/**
 * 제목 텍스트 색상을 결정합니다 (배경색에 따라)
 */
export const getTextColor = (bgColor: string): string => {
  // 밝은 색상이면 어두운 텍스트, 어두운 색상이면 밝은 텍스트
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF";
};
