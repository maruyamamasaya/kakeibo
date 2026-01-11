"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AUTH_COOKIE_KEY,
  AUTH_STATE_KEY,
  AUTH_VERIFIER_KEY,
  TOKEN_STORAGE_KEY,
  buildCognitoAuthorizeUrl,
  getLoginRedirectTarget,
  isCognitoConfigured,
  isExternalUrl,
} from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectLabel, setRedirectLabel] = useState("");

  const setAuthCookie = () => {
    const maxAgeSeconds = 60 * 60 * 24 * 7;
    document.cookie = `${AUTH_COOKIE_KEY}=true; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
  };

  const redirectAfterLogin = () => {
    const target = getLoginRedirectTarget(
      new URLSearchParams(window.location.search),
    );

    if (isExternalUrl(target)) {
      window.location.assign(target);
      return;
    }

    router.replace(target);
  };

  const exchangeCodeForTokens = async (code: string, state: string) => {
    const storedState = window.sessionStorage.getItem(AUTH_STATE_KEY);
    const codeVerifier = window.sessionStorage.getItem(AUTH_VERIFIER_KEY);

    if (!storedState || storedState !== state) {
      throw new Error("認証状態が一致しません。再度ログインしてください。");
    }

    if (!codeVerifier) {
      throw new Error("認証情報が見つかりません。再度ログインしてください。");
    }

    const response = await fetch("/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        codeVerifier,
      }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type") ?? "";
      let details = "";

      if (contentType.includes("application/json")) {
        const data = (await response.json()) as
          | { error?: string; error_description?: string }
          | undefined;
        if (data?.error || data?.error_description) {
          details = [data?.error, data?.error_description]
            .filter(Boolean)
            .join(": ");
        }
      } else {
        details = (await response.text()).trim();
      }

      const suffix = details
        ? ` (${response.status}: ${details})`
        : ` (${response.status})`;
      throw new Error(`トークンの取得に失敗しました。${suffix}`);
    }

    const tokens = await response.json();
    window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    window.sessionStorage.removeItem(AUTH_STATE_KEY);
    window.sessionStorage.removeItem(AUTH_VERIFIER_KEY);
    setAuthCookie();
  };

  const generateCodeVerifier = () => {
    const buffer = new Uint8Array(32);
    window.crypto.getRandomValues(buffer);
    return btoa(String.fromCharCode(...buffer))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const base64UrlEncode = (input: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const createCodeChallenge = async (verifier: string) => {
    const data = new TextEncoder().encode(verifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return base64UrlEncode(digest);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!isCognitoConfigured()) {
      setErrorMessage("Cognito の設定が不足しています。環境変数を確認してください。");
      return;
    }

    const url = new URL(window.location.href);
    setRedirectLabel(getLoginRedirectTarget(url.searchParams));
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (code && state) {
      setIsSubmitting(true);
      exchangeCodeForTokens(code, state)
        .then(() => redirectAfterLogin())
        .catch((error) => {
          setErrorMessage(
            error instanceof Error ? error.message : "ログインに失敗しました。",
          );
          setIsSubmitting(false);
        });
      return;
    }

    const alreadyLoggedIn = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith(`${AUTH_COOKIE_KEY}=`));
    if (alreadyLoggedIn) {
      redirectAfterLogin();
    }
  }, [router]);

  const handleLogin = async () => {
    if (typeof window === "undefined") {
      return;
    }

    if (!isCognitoConfigured()) {
      setErrorMessage("Cognito の設定が不足しています。環境変数を確認してください。");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const state = crypto.randomUUID();
    const verifier = generateCodeVerifier();
    const challenge = await createCodeChallenge(verifier);

    window.sessionStorage.setItem(AUTH_STATE_KEY, state);
    window.sessionStorage.setItem(AUTH_VERIFIER_KEY, verifier);

    const loginUrl = buildCognitoAuthorizeUrl({
      state,
      codeChallenge: challenge,
    });
    window.location.assign(loginUrl);
  };

  return (
    <main className="login-screen">
      <div className="login-card">
        <p className="eyebrow">Welcome</p>
        <h1>家計簿にログイン</h1>
        <p className="login-note">
          まずはログインしてください。ログイン後にメイン画面へ移動します。
        </p>
        <button
          type="button"
          className="primary"
          onClick={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? "ログイン中..." : "ログインする"}
        </button>
        {errorMessage ? (
          <p className="login-error">{errorMessage}</p>
        ) : null}
        <p className="login-helper">
          遷移先: <span>{redirectLabel || getLoginRedirectTarget()}</span>
        </p>
      </div>
    </main>
  );
}
