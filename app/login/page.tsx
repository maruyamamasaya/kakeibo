"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LOGIN_STORAGE_KEY = "kakeibo:logged-in";

const getRedirectPath = () =>
  process.env.NEXT_PUBLIC_LOGIN_REDIRECT_PATH || "/";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const alreadyLoggedIn = window.localStorage.getItem(LOGIN_STORAGE_KEY);
    if (alreadyLoggedIn) {
      router.replace(getRedirectPath());
    }
  }, [router]);

  const handleLogin = () => {
    if (typeof window === "undefined") {
      return;
    }

    setIsSubmitting(true);
    window.localStorage.setItem(LOGIN_STORAGE_KEY, "true");
    router.push(getRedirectPath());
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
          遷移先: <span>{getRedirectPath()}</span>
        </p>
      </div>
    </main>
  );
}
