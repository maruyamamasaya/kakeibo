"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getLoginRedirectTarget,
  isExternalUrl,
  LOGIN_STORAGE_KEY,
} from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const alreadyLoggedIn = window.localStorage.getItem(LOGIN_STORAGE_KEY);
    if (alreadyLoggedIn) {
      router.replace(getLoginRedirectTarget());
    }
  }, [router]);

  const handleLogin = () => {
    if (typeof window === "undefined") {
      return;
    }

    const redirectTarget = getLoginRedirectTarget();

    setIsSubmitting(true);
    window.localStorage.setItem(LOGIN_STORAGE_KEY, "true");

    if (isExternalUrl(redirectTarget)) {
      window.location.assign(redirectTarget);
      return;
    }

    router.push(redirectTarget);
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
        <p className="login-helper">
          遷移先: <span>{getLoginRedirectTarget()}</span>
        </p>
      </div>
    </main>
  );
}
