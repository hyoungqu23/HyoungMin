"use client";
import Clarity from "@microsoft/clarity";

import { useEffect } from "react";

export const ClarityAnalytics = () => {
  useEffect(() => {
    Clarity.init(process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID!);
  }, []);

  return null;
};
