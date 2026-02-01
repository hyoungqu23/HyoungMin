/**
 * 캘린더 이벤트 관련 유틸리티 함수들
 */

/** 날짜 문자열을 파싱하여 각 부분을 추출 */
export const getDateParts = (dateStr: string) => {
  const [datePart, timePart = "00:00"] = dateStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if ([year, month, day, hour, minute].some(Number.isNaN)) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  return { year, month, day, hour, minute };
};

/** 날짜 문자열을 Date 객체로 변환 */
export const parseDateTime = (dateStr: string): Date => {
  const { year, month, day, hour, minute } = getDateParts(dateStr);
  return new Date(year, month - 1, day, hour, minute);
};

/** 날짜를 iCalendar 형식(YYYYMMDDTHHMMSS)으로 포맷 */
export const formatToIcsDate = (dateStr: string): string => {
  const date = parseDateTime(dateStr);
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${YYYY}${MM}${DD}T${HH}${mm}00`;
};

/** 구글 캘린더 URL 생성 */
export const buildGoogleCalendarUrl = ({
  title,
  description,
  location,
  startDate,
  endDate,
}: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
}): string => {
  const start = formatToIcsDate(startDate);
  const end = formatToIcsDate(endDate);

  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(description)}` +
    `&location=${encodeURIComponent(location)}` +
    `&ctz=Asia/Seoul`
  );
};

/** 네이티브 캘린더 URL 생성 (webcal scheme 기반 - 애플 캘린더, 네이버 캘린더 등 지원) */
export const buildNativeCalendarUrl = ({
  title,
  description,
  location,
  startDate,
  endDate,
}: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
}): string => {
  const start = formatToIcsDate(startDate);
  const end = formatToIcsDate(endDate);

  // data URI scheme을 사용하여 ICS 파일 직접 생성
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//KR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `DTSTART;TZID=Asia/Seoul:${start}`,
    `DTEND;TZID=Asia/Seoul:${end}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
};

/** ICS 텍스트 이스케이프 */
const escapeIcsText = (value: string): string => {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
};
