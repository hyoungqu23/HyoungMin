"use server";

import {
  attendanceFormSchema,
  type AttendanceForm,
} from "../_schemas/attendance-form";
import { appendAttendanceData, appendErrorLog } from "./append-spreadsheet";

export const submitAttendance = async (
  formData: AttendanceForm,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const validatedData = attendanceFormSchema.parse(formData);

    const finalCount =
      validatedData.countType === "custom"
        ? Number(validatedData.customCount)
        : Number(validatedData.countType);

    const attendanceData = {
      side: validatedData.side,
      name: validatedData.name,
      count: finalCount,
      meal: validatedData.meal,
      guestNames: validatedData.guestNames,
    };

    // 성공 데이터를 Spreadsheet에 저장
    await appendAttendanceData(attendanceData);

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("참석 정보 저장 실패:", error);

    // 에러를 Spreadsheet에 로깅
    await appendErrorLog({
      error: errorMessage,
      formData: formData,
      stack: errorStack,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
};
