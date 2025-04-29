import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/";

  const token = request.cookies.get("accessToken")?.value || "";

  // If user is trying to access a protected page and is not authenticated, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home"],
};
