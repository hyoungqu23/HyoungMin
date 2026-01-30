"use client";
import Clarity from "@microsoft/clarity";

import { useEffect } from "react";

export const ClarityAnalytics = () => {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID;
    if (!projectId || !projectId.trim()) return;
    Clarity.init(projectId);
  }, []);

  return null;
};
