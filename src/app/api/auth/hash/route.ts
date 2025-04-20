import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

/**
 * API สำหรับ hash password
 */
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'ต้องระบุรหัสผ่าน' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    return NextResponse.json({ hashedPassword });
  } catch (error) {
    console.error('Password hash API error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน' },
      { status: 500 }
    );
  }
} 