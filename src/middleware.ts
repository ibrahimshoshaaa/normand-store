// Normand — admin password gate.
// Protects /admin/* (except /admin/login) when ADMIN_PASSWORD is set.
// If ADMIN_PASSWORD is not set, the admin is left open and the admin layout
// shows a warning banner instead — set the password before going live.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const password = process.env.ADMIN_PASSWORD;
  if (!password) return NextResponse.next();

  const authed = await verifyAdminCookie(req.cookies.get(ADMIN_COOKIE)?.value, password);
  if (authed) return NextResponse.next();

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
