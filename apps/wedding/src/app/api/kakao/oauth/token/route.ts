const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";

type TokenRequestBody = {
  code?: string;
  redirectUri?: string;
};

export async function POST(request: Request) {
  const restApiKey = process.env.KAKAO_REST_API_KEY;

  if (!restApiKey) {
    return new Response("Missing KAKAO_REST_API_KEY.", { status: 500 });
  }

  const body = (await request.json()) as TokenRequestBody;
  const code = body.code ?? "";
  const redirectUri = body.redirectUri ?? "";

  if (!code || !redirectUri) {
    return new Response("Missing code or redirectUri.", { status: 400 });
  }

  const form = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: restApiKey,
    redirect_uri: redirectUri,
    code,
  });

  const response = await fetch(KAKAO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: form.toString(),
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, { status: response.status });
}
