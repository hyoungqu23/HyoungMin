"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { submitAttendance } from "../../_actions/submit-attendance";
import {
  attendanceFormSchema,
  type AttendanceForm as AttendanceFormType,
} from "../../_schemas/attendance-form";

const sideOptions = [
  { value: "groom" as const, label: "신랑측" },
  { value: "bride" as const, label: "신부측" },
];
const countOptions = ["1", "2", "3", "custom"];
const mealOptions = [
  { value: "yes" as const, label: "식사해요" },
  { value: "no" as const, label: "마음만 전해요" },
  { value: "not_sure" as const, label: "미정" },
];

type Props = {
  onSuccess?: () => void;
};

export const AttendanceForm = ({ onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AttendanceFormType>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: { countType: "1" },
  });

  const watchedValues = useWatch({
    control,
    name: ["side", "countType", "meal"],
  });
  const [selectedSide, selectedCountType, selectedMeal] = watchedValues;

  const onSubmit: SubmitHandler<AttendanceFormType> = useCallback(
    async (data: AttendanceFormType) => {
      try {
        const result = await submitAttendance(data);

        if (result.success) {
          alert("소중한 의사가 전달되었습니다. 감사합니다! 🌸");
          onSuccess?.();
        } else {
          alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error(error);
        alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    },
    [onSuccess],
  );

  return (
    <div className="overflow-y-auto p-6 pb-10">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* --- 1. 구분 --- */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            {sideOptions.map((item) => (
              <label
                key={item.value}
                className={`
                  relative flex items-center justify-center py-2 rounded-xl border cursor-pointer transition-all duration-200
                  ${
                    selectedSide === item.value
                      ? "bg-rose-50 border-rose-400 text-rose-600 font-bold shadow-sm"
                      : "border-stone-200 text-stone-500 hover:bg-stone-50"
                  }
                `}
              >
                <input
                  type="radio"
                  value={item.value}
                  {...register("side", { required: "선택해주세요." })}
                  className="absolute opacity-0 w-0 h-0"
                />
                {item.label}
              </label>
            ))}
          </div>

          {errors.side && (
            <p className="text-xs text-rose-500 mt-1">{errors.side.message}</p>
          )}
        </div>

        {/* --- 2. 성함 --- */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-600">
            성함 <span className="text-rose-500">*</span>
          </label>

          <input
            type="text"
            placeholder="성함을 입력해주세요"
            {...register("name", { required: "성함을 입력해주세요." })}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition placeholder:text-stone-400 text-stone-800"
          />
          {errors.name && (
            <p className="text-xs text-rose-500">{errors.name.message}</p>
          )}
        </div>

        {/* --- 3. 참석 인원 --- */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-600">
            참석 인원(본인 포함) <span className="text-rose-500">*</span>
          </label>

          <div className="flex gap-2">
            {countOptions.map((val) => (
              <label
                key={val}
                className={`
                  flex-1 flex items-center justify-center py-2 rounded-xl border cursor-pointer transition-all duration-200
                  ${
                    selectedCountType === val
                      ? "bg-rose-50 border-rose-400 text-rose-600 font-bold shadow-sm"
                      : "border-stone-200 text-stone-500 hover:bg-stone-50"
                  }
                `}
              >
                <input
                  type="radio"
                  value={val}
                  {...register("countType", {
                    required: "인원 수를 선택해주세요.",
                  })}
                  className="hidden"
                />
                {val === "custom" ? "직접입력" : `${val}명`}
              </label>
            ))}
          </div>

          {/* 직접 입력 시 나타나는 인풋 */}
          <AnimatePresence>
            {selectedCountType === "custom" && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="number"
                  placeholder="총 인원 수를 숫자로 입력 (예: 5)"
                  {...register("customCount", {
                    valueAsNumber: true,
                    onChange: (e) => {
                      if (!/^\d+$/.test(e.target.value)) {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }
                    },
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition"
                />
                {errors.customCount && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.customCount.message}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- 4. 식사 여부 --- */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-600">
            식사 여부 <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {mealOptions.map((item) => (
              <label
                key={item.value}
                className={`
                  flex items-center justify-center py-2 rounded-xl border cursor-pointer transition-all whitespace-nowrap
                  ${
                    selectedMeal === item.value
                      ? "bg-rose-50 border-rose-400 text-rose-600 font-bold"
                      : "border-stone-200 text-stone-500 hover:bg-stone-50"
                  }
                `}
              >
                <input
                  type="radio"
                  value={item.value}
                  {...register("meal", {
                    required: "식사 여부를 선택해주세요.",
                  })}
                  className="hidden"
                />
                {item.label}
              </label>
            ))}
          </div>
          {errors.meal && (
            <p className="text-xs text-rose-500 mt-1">{errors.meal.message}</p>
          )}
        </div>

        {/* --- 5. 동행인 성함 (선택) --- */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-600">
            동행인 성함{" "}
            <span className="text-xs font-normal text-stone-400">(선택)</span>
          </label>
          <input
            type="text"
            placeholder="동행하시는 분들의 성함을 입력해주세요"
            {...register("guestNames")}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition placeholder:text-stone-400 text-stone-800"
          />
        </div>

        {/* --- 제출 버튼 --- */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded-xl bg-rose-500 text-white font-bold text-lg shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-95 disabled:bg-rose-300 disabled:scale-100 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              전송 중...
            </>
          ) : (
            "참석 여부 전달하기"
          )}
        </button>
      </form>
    </div>
  );
};
