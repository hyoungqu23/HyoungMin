import type { Config } from "tailwindcss";

/**
 * 디자인 시스템 색상 토큰 구조
 *
 * 이 파일은 색상 토큰의 구조만 정의합니다.
 * 실제 색상 값은 각 앱의 globals.css에서 CSS 변수로 정의됩니다.
 *
 * 사용 예시:
 * - apps/blog: Prestige Green + Impact Gold
 * - apps/admin: 다른 색상 조합 가능
 */
export const colorTokens = {
  primary: {
    50: "var(--primary-50)",
    100: "var(--primary-100)",
    200: "var(--primary-200)",
    300: "var(--primary-300)",
    400: "var(--primary-400)",
    500: "var(--primary-500)",
    600: "var(--primary-600)",
    700: "var(--primary-700)",
    800: "var(--primary-800)",
    900: "var(--primary-900)",
  },
  secondary: {
    50: "var(--secondary-50)",
    100: "var(--secondary-100)",
    200: "var(--secondary-200)",
    300: "var(--secondary-300)",
    400: "var(--secondary-400)",
    500: "var(--secondary-500)",
    600: "var(--secondary-600)",
    700: "var(--secondary-700)",
    800: "var(--secondary-800)",
    900: "var(--secondary-900)",
  },
} as const;

/**
 * Tailwind 설정 확장용
 * 각 앱의 tailwind.config.ts에서 사용:
 *
 * import { designSystemConfig } from "@hyoungmin/design-system/tailwind";
 *
 * export default {
 *   theme: {
 *     extend: {
 *       colors: designSystemConfig.theme.extend.colors,
 *     },
 *   },
 * };
 */
export const designSystemConfig = {
  theme: {
    extend: {
      colors: colorTokens,
    },
  },
} satisfies Partial<Config>;

// 기본 export는 호환성을 위해 유지
export default designSystemConfig;
