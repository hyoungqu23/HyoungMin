"use server";

import { google } from "googleapis";
import { JWT } from "google-auth-library";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME || "참석자 명단";

const getSheetsClient = () => {
  if (!SPREADSHEET_ID) {
    throw new Error(
      "GOOGLE_SHEETS_SPREADSHEET_ID 환경 변수가 설정되지 않았습니다.",
    );
  }

  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ auth, version: "v4" });
};

const getTimestamp = () => {
  return new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
};

type AttendanceData = {
  side: "groom" | "bride";
  name: string;
  count: number;
  meal: "yes" | "no" | "not_sure";
  guestNames?: string;
};

type ErrorData = {
  error: string;
  formData?: unknown;
  stack?: string;
};

export const appendAttendanceData = async (
  data: AttendanceData,
): Promise<void> => {
  const sheets = getSheetsClient();

  const timestamp = getTimestamp();

  const mealMap: Record<string, string> = {
    yes: "식사 예정",
    no: "마음만 전함",
    not_sure: "모르겠어요",
  };

  const row = [
    timestamp,
    data.side === "groom" ? "신랑측" : "신부측",
    data.name,
    data.count.toString(),
    mealMap[data.meal] || data.meal,
    data.guestNames || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID!,
    range: `${SHEET_NAME}!A:F`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
};

export const appendErrorLog = async (errorData: ErrorData): Promise<void> => {
  try {
    const sheets = getSheetsClient();

    const timestamp = getTimestamp();

    const row = [
      timestamp,
      errorData.error,
      errorData.formData ? JSON.stringify(errorData.formData) : "",
      errorData.stack || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID!,
      range: `${SHEET_NAME}!H:K`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });
  } catch (logError) {
    console.error("에러 로깅 실패:", logError);
    console.error("원본 에러:", errorData);
  }
};
