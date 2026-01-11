"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AUTH_COOKIE_KEY } from "../lib/auth";

const hasAuthCookie = () => {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(`${AUTH_COOKIE_KEY}=`));
};

export const useLoginGuard = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!hasAuthCookie()) {
      router.replace("/login");
      return;
    }

    setIsReady(true);
  }, [router]);

  return { isReady };
};
