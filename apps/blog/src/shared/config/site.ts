const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const devFallback =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined;

/**
 * 사이트의 기본 도메인을 반환합니다.
 * 프로덕션에서는 NEXT_PUBLIC_SITE_URL을 반드시 설정하도록 강제하고,
 * 로컬 개발만 기본값을 허용합니다.
 */
export const siteUrl = (() => {
  const value = envSiteUrl ?? devFallback;

  if (!value) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is required in production to generate correct SEO metadata.",
    );
  }

  try {
    // 유효한 URL인지 검증하고, 뒤쪽 슬래시는 제거해 일관성을 맞춥니다.
    const url = new URL(value);
    return url.origin;
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be a valid URL (received: ${value})`,
    );
  }
})();
