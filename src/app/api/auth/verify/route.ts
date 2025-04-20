import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';

export const runtime = 'nodejs';

/**
 * API สำหรับตรวจสอบรหัสผ่าน
 */
export async function POST(req: NextRequest) {
  try {
    const { password, hashedPassword } = await req.json();
    
    if (!password || !hashedPassword) {
      return NextResponse.json(
        { message: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }
    
    const isValid = await compare(password, hashedPassword);
    return NextResponse.json({ isValid });
  } catch (error) {
    console.error('Verify password error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน' },
      { status: 500 }
    );
  }
} 