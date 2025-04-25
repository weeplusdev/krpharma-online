import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ตรวจสอบว่าเป็น path ที่ต้องการ authentication หรือไม่
  const isAuthRequired =
    pathname.startsWith("/web/account") ||
    pathname.startsWith("/web/orders") ||
    pathname.startsWith("/liff/account") ||
    pathname.startsWith("/liff/orders") ||
    pathname.startsWith("/admin")

  // ถ้าไม่ต้องการ authentication ให้ผ่านไปได้เลย
  if (!isAuthRequired) {
    return NextResponse.next()
  }

  try {
    // ตรวจสอบ token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // ถ้าไม่มี token ให้ redirect ไปที่หน้า login
    if (!token) {
      // ตรวจสอบว่าเป็น path ของ LIFF หรือไม่
      const isLiffPath = pathname.startsWith("/liff/")
      const signInUrl = isLiffPath ? "/liff/auth/signin" : "/web/auth/signin"

      return NextResponse.redirect(new URL(signInUrl, request.url))
    }

    // ตรวจสอบสิทธิ์ admin สำหรับหน้า admin
    if (pathname.startsWith("/admin") && token.role !== "admin") {
      const redirectPath = pathname.startsWith("/liff/") ? "/liff" : "/web"
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }

    // ถ้ามี token ให้ผ่านไปได้
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // ในกรณีที่เกิดข้อผิดพลาด ให้ redirect ไปที่หน้าหลัก
    const fallbackPath = pathname.startsWith("/liff/") ? "/liff" : "/web"
    return NextResponse.redirect(new URL(fallbackPath, request.url))
  }
}

// ระบุ path ที่ต้องการให้ middleware ทำงาน
export const config = {
  matcher: [
    "/web/account/:path*",
    "/web/orders/:path*",
    "/liff/account/:path*",
    "/liff/orders/:path*",
    "/admin/:path*",
  ],
}
