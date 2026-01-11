import { NextResponse } from "next/server";

import { getCognitoConfig, getCognitoTokenUrl } from "../../../lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = async (request: Request) => {
  const { clientId, redirectUri } = getCognitoConfig();
  const clientSecret = process.env.COGNITO_CLIENT_SECRET ?? "";

  if (!clientId || !redirectUri || !clientSecret) {
    return NextResponse.json(
      { error: "Cognito の設定が不足しています。" },
      { status: 500 },
    );
  }

  const payload = (await request.json()) as {
    code?: string;
    codeVerifier?: string;
  };

  if (!payload.code || !payload.codeVerifier) {
    return NextResponse.json(
      { error: "認証情報が不足しています。" },
      { status: 400 },
    );
  }

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  body.set("code", payload.code);
  body.set("redirect_uri", redirectUri);
  body.set("code_verifier", payload.codeVerifier);

  const response = await fetch(getCognitoTokenUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const data = (await response.json()) as Record<string, unknown>;
    return NextResponse.json(data, { status: response.status });
  }

  const text = (await response.text()).trim();
  return NextResponse.json(
    text ? { error: text } : { error: "Unknown error" },
    { status: response.status },
  );
};
