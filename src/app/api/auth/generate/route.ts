import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import crypto from 'crypto';

export const runtime = 'nodejs';

/**
 * API สำหรับสร้างรหัสผ่านที่ปลอดภัยแบบสุ่ม
 */
export async function POST() {
  try {
    // สร้างรหัสผ่านสุ่มที่ปลอดภัย
    const randomPassword = crypto.randomBytes(12).toString('hex');
    
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await hash(randomPassword, 10);

    return NextResponse.json({ hashedPassword });
  } catch (error) {
    console.error('Generate password error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการสร้างรหัสผ่าน' },
      { status: 500 }
    );
  }
} 