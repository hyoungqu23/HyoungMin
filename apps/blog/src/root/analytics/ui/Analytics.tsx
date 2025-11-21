import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

import { ClarityAnalytics } from "./ClarityAnalytics";

export const Analytics = () => {
  const googleAnalyticsId =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID;

  const hasGoogleAnalytics = Boolean(
    googleAnalyticsId && googleAnalyticsId.trim(),
  );

  return (
    <>
      {hasGoogleAnalytics ? (
        <GoogleAnalytics gaId={googleAnalyticsId!} />
      ) : null}
      <ClarityAnalytics />
      <VercelAnalytics />
    </>
  );
};
