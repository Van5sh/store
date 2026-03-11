import { NextRequest, NextResponse } from "next/server"

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value
  const role = req.cookies.get("role")?.value
  const pathname = req.nextUrl.pathname

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  
  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(`/${role}`, req.url))
  }

  if (pathname.startsWith("/vendor") && role !== "vendor") {
    return NextResponse.redirect(new URL(`/${role}`, req.url))
  }

  if (pathname.startsWith("/customer") && role !== "customer") {
    return NextResponse.redirect(new URL(`/${role}`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/vendor/:path*", "/customer/:path*"],
}
