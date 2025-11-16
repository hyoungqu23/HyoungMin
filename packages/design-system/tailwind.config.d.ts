import type { Config } from "tailwindcss";

export const colorTokens: {
  readonly primary: {
    readonly 50: string;
    readonly 100: string;
    readonly 200: string;
    readonly 300: string;
    readonly 400: string;
    readonly 500: string;
    readonly 600: string;
    readonly 700: string;
    readonly 800: string;
    readonly 900: string;
  };
  readonly secondary: {
    readonly 50: string;
    readonly 100: string;
    readonly 200: string;
    readonly 300: string;
    readonly 400: string;
    readonly 500: string;
    readonly 600: string;
    readonly 700: string;
    readonly 800: string;
    readonly 900: string;
  };
};

export const designSystemConfig: {
  theme: {
    extend: {
      colors: typeof colorTokens;
    };
  };
};

export default typeof designSystemConfig;
