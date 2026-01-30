"use server";

import { Redis } from "@upstash/redis";
import {
  attendanceFormSchema,
  type AttendanceForm,
} from "../_schemas/attendance-form";

const redis = Redis.fromEnv();
const ATTENDANCE_KEY = "wedding:attendances";

export type AttendanceData = {
  id: string;
  side: "groom" | "bride";
  name: string;
  count: number;
  meal: "yes" | "no" | "not_sure";
  guestNames?: string;
  createdAt: number;
};

export const submitAttendance = async (
  formData: AttendanceForm,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const validatedData = attendanceFormSchema.parse(formData);

    const finalCount =
      validatedData.countType === "custom"
        ? Number(validatedData.customCount)
        : Number(validatedData.countType);

    const now = Date.now();
    const attendanceData: AttendanceData = {
      id: now.toString(),
      side: validatedData.side,
      name: validatedData.name,
      count: finalCount,
      meal: validatedData.meal,
      guestNames: validatedData.guestNames,
      createdAt: now,
    };

    // Redis에 저장
    await redis.lpush(ATTENDANCE_KEY, attendanceData);

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";

    console.error("참석 정보 저장 실패:", error);

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const getAttendanceCount = async (): Promise<number> => {
  try {
    return await redis.llen(ATTENDANCE_KEY);
  } catch {
    return 0;
  }
};
