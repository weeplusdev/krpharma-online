import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

export const runtime = 'nodejs';

/**
 * API สำหรับ hash password
 */
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    if (!password) {
      return NextResponse.json(
        { message: 'รหัสผ่านไม่ถูกต้อง' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await hash(password, 10);
    return NextResponse.json({ hashedPassword });
  } catch (error) {
    console.error('Hash password error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน' },
      { status: 500 }
    );
  }
} 