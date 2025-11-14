import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

import { ClarityAnalytics } from "./ClarityAnalytics";

export const Analytics = () => {
  return (
    <>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID!}
      />
      <ClarityAnalytics />
      <VercelAnalytics />
    </>
  );
};
