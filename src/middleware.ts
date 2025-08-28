import { NextRequest, NextResponse } from "next/server";
import api from "./config/axios";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawHost = request.headers.get("host") || "";
  const host = rawHost.split(":")[0];
  const subdomain = host.split(".")[0];

  const isAdminSubdomain = subdomain === "admin-system";
  if (!isAdminSubdomain) {
    return NextResponse.rewrite(new URL("/fs/not-found", request.url));
  }

  const publicRoutes = ["/", "/recovery-password/"];

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
      return NextResponse.redirect(new URL("/fs/dashboard", request.url));
    }

    return NextResponse.rewrite(new URL(`/fs/${pathname}`, request.url));
  }

  if (!token && pathname !== "/" && !pathname.startsWith("/public")) {
    return NextResponse.redirect(new URL("/fs/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Inclui explicitamente a raiz "/" (que vira /fs por causa do basePath)
    "/",
    // E todas as demais rotas, excluindo assets e api
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico)$).*)",
  ],
};
