import Script from "next/script";

export const ClarityAnalytics = () => {
  const clarityTag = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_TRACK_CODE;
  const hasClarity = Boolean(clarityTag && clarityTag.trim());

  if (!hasClarity) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity-script"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityTag}");`,
      }}
    />
  );
};
