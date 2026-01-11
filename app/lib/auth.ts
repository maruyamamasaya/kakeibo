export const AUTH_COOKIE_KEY = "kakeibo:auth";
export const AUTH_STATE_KEY = "kakeibo:oauth-state";
export const AUTH_VERIFIER_KEY = "kakeibo:pkce-verifier";
export const TOKEN_STORAGE_KEY = "kakeibo:tokens";

export const getLoginRedirectTarget = (searchParams?: URLSearchParams) => {
  const redirectFromQuery = searchParams?.get("redirect");
  if (redirectFromQuery && !isExternalUrl(redirectFromQuery)) {
    return redirectFromQuery;
  }

  return process.env.NEXT_PUBLIC_LOGIN_REDIRECT_PATH || "/summary";
};

export const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);

export const getCognitoConfig = () => ({
  domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "",
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
  redirectUri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || "",
});

export const isCognitoConfigured = () => {
  const { domain, clientId, redirectUri } = getCognitoConfig();
  return Boolean(domain && clientId && redirectUri);
};

export const buildCognitoAuthorizeUrl = ({
  state,
  codeChallenge,
}: {
  state: string;
  codeChallenge: string;
}) => {
  const { domain, clientId, redirectUri } = getCognitoConfig();
  const url = new URL(`https://${domain}/oauth2/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", codeChallenge);
  return url.toString();
};

export const getCognitoTokenUrl = () => {
  const { domain } = getCognitoConfig();
  return `https://${domain}/oauth2/token`;
};
