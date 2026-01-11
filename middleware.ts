import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE_KEY } from "./app/lib/auth";

const PUBLIC_PATHS = ["/login"];

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPath || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const hasAuthCookie = request.cookies.get(AUTH_COOKIE_KEY)?.value;
  if (!hasAuthCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set(
      "redirect",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|.*\\..*).*)"],
};
