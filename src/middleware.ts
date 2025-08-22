import { NextRequest, NextResponse } from "next/server";
import api from "./config/axios";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/sign-in/", "/recovery-password/"];

  const isPublicRoute = publicRoutes.includes(pathname);

  const token = request.cookies.get("token")?.value;
  const user = request.cookies.get("user")?.value;

  if (!user && token) {
    const response = await api.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      const nextResponse = NextResponse.next();
      nextResponse.cookies.set("user", JSON.stringify(response.data), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1,
      });
      return nextResponse;
    }
  }

  if (isPublicRoute) {
    if (token) {
      return NextResponse.redirect(
        new URL("/front_system/dashboard", request.url)
      );
    }

    return NextResponse.rewrite(
      new URL(`/front_system/${pathname}`, request.url)
    );
  }

  if (!token && pathname !== "/" && !pathname.startsWith("/public")) {
    return NextResponse.redirect(new URL("/front_system/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.ico$).*)",
  ],
};
