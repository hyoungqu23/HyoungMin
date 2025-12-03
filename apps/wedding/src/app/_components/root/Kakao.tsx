"use client";

import Script from "next/script";

export const Kakao = () => {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js"
      integrity="sha384-JpLApTkB8lPskhVMhT+m5Ln8aHlnS0bsIexhaak0jOhAkMYedQoVghPfSpjNi9K1"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_SDK_API_KEY!);
      }}
    />
  );
};
