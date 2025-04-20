import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

/**
 * API สำหรับตรวจสอบรหัสผ่าน
 */
export async function POST(req: NextRequest) {
  try {
    const { password, hashedPassword } = await req.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'ต้องระบุรหัสผ่าน' },
        { status: 400 }
      );
    }
    
    if (!hashedPassword) {
      return NextResponse.json(
        { error: 'ต้องระบุรหัสผ่านที่เข้ารหัสแล้ว' },
        { status: 400 }
      );
    }
    
    const isValid = await bcrypt.compare(password, hashedPassword);
    return NextResponse.json({ isValid });
  } catch (error) {
    console.error('Password verify API error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน' },
      { status: 500 }
    );
  }
} 