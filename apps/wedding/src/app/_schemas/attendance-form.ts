import { z } from "zod";

export const attendanceFormSchema = z
  .object({
    side: z.literal("groom").or(z.literal("bride")),
    name: z.string().trim().min(1, "성함을 입력해주세요."),
    countType: z
      .literal("1")
      .or(z.literal("2"))
      .or(z.literal("3"))
      .or(z.literal("custom")),
    customCount: z.number().int().positive().optional(),
    meal: z.literal("yes").or(z.literal("no")).or(z.literal("not_sure")),
    guestNames: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.countType === "custom") {
        return data.customCount && data.customCount > 0;
      }
      return true;
    },
    {
      message: "인원 수를 정확히 입력해주세요.",
      path: ["customCount"],
    },
  );

export type AttendanceForm = z.infer<typeof attendanceFormSchema>;
