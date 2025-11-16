import { designSystemConfig } from "@hyoungmin/design-system";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./contents/**/*.mdx",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  plugins: [typography],
  theme: {
    extend: {
      colors: {
        ...designSystemConfig.theme?.extend?.colors,
      },
    },
  },
} satisfies Config;
