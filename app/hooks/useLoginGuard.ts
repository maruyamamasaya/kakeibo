"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LOGIN_STORAGE_KEY } from "../lib/auth";

export const useLoginGuard = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loggedIn = window.localStorage.getItem(LOGIN_STORAGE_KEY);
    if (!loggedIn) {
      router.replace("/login");
      return;
    }

    setIsReady(true);
  }, [router]);

  return { isReady };
};
