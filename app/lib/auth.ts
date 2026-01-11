export const LOGIN_STORAGE_KEY = "kakeibo:logged-in";

export const getLoginRedirectTarget = () =>
  process.env.NEXT_PUBLIC_LOGIN_REDIRECT_PATH || "/summary";

export const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);
