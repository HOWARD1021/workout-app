import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (request.nextUrl.pathname !== "/" && !sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();
  if (request.nextUrl.pathname === "/") {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }
  return response;
}

export const config = {
  matcher: ["/", "/log", "/templates", "/analytics"],
};
