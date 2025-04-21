import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// เส้นทางที่ต้องการป้องกันโดยต้องเข้าสู่ระบบก่อน
const protectedRoutes = [
  '/products/manage',
  '/admin',
  '/dashboard',
  '/account',
  '/orders',
];

// เส้นทางที่จะแสดงเฉพาะเมื่อยังไม่ได้เข้าสู่ระบบ
const publicOnlyRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
];

export async function middleware(request: NextRequest) {
  // ดึง token จาก session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  const { pathname } = request.nextUrl;
  
  // ตรวจสอบเส้นทางที่ต้องมีการเข้าสู่ระบบก่อน
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      // ถ้ายังไม่ได้เข้าสู่ระบบ ให้เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // ตรวจสอบสิทธิ์ตามบทบาท (ถ้าจำเป็น)
    if (pathname.startsWith('/admin') && (!token || !(token.role === 'admin'))) {
      // ถ้าไม่ใช่ admin แต่พยายามเข้าถึงหน้า admin
      return NextResponse.redirect(new URL('/products', request.url));
    }
  }
  
  // ตรวจสอบเส้นทางที่จะแสดงเฉพาะเมื่อยังไม่ได้เข้าสู่ระบบ
  if (publicOnlyRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      // ถ้าเข้าสู่ระบบแล้ว ให้เปลี่ยนเส้นทางไปยังหน้าหลัก
      return NextResponse.redirect(new URL('/products', request.url));
    }
  }
  
  // สำหรับเส้นทางอื่นๆ ให้ดำเนินการตามปกติ
  return NextResponse.next();
}

// กำหนดเส้นทางที่ middleware นี้จะทำงาน
export const config = {
  matcher: [
    // ตรวจสอบทุกเส้นทางยกเว้น
    // - เส้นทาง API ที่เริ่มต้นด้วย `/api`
    // - เส้นทาง static files เช่น `/images`, `/_next`
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 