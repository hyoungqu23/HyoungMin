export {};

declare global {
  type KakaoAuth = {
    authorize: (options: {
      redirectUri: string;
      scope?: string;
      state?: string;
    }) => void;
    setAccessToken: (token: string) => void;
    getAccessToken?: () => string | null;
  };

  type KakaoApi = {
    request: (options: {
      url: string;
      data?: Record<string, unknown>;
    }) => Promise<unknown>;
  };

  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (options: unknown) => void;
      };
      Auth?: KakaoAuth;
      API?: KakaoApi;
    };
  }
}
