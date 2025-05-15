import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value || 
    request.cookies.get("__Secure-authjs.session-token")?.value; 

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/wallet") && !sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/" && sessionToken) {
    return NextResponse.redirect(new URL("/wallet", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/wallet"],
};
