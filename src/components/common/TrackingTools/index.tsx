import Script from 'next/script';

const TrackingTools = () => {
  return (
    <>
      <Script
        id='microsoft-clarity-script'
        dangerouslySetInnerHTML={{
          __html: `(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_TRACK_CODE}");`,
        }}
      />
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID}`}
      ></Script>
      <Script
        id='google-analytics-script'
        dangerouslySetInnerHTML={{
          __html: ` window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID}');`,
        }}
      />
      <meta
        name='google-site-verification'
        content='bifggwBk-paprwdgYduW7jTkn7lspxQAmuz2eQOq4Hg'
      />
    </>
  );
};

export default TrackingTools;
