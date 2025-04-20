import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const runtime = 'node'

/**
 * สร้าง random bytes โดยใช้ crypto ของ Node
 */
function generateRandomHexString(byteLength: number): string {
  const array = new Uint8Array(byteLength);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * API สำหรับ hash password
 */
export async function POST(req: NextRequest) {
  try {
    const { password, action } = await req.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'ต้องระบุรหัสผ่าน' },
        { status: 400 }
      );
    }
    
    // กรณี hash รหัสผ่าน
    if (action === 'hash') {
      const hashedPassword = await bcrypt.hash(password, 10);
      return NextResponse.json({ hashedPassword });
    }
    
    // กรณีสร้างรหัสผ่านแบบสุ่ม
    if (action === 'generate') {
      const randomPassword = generateRandomHexString(16);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      return NextResponse.json({ 
        plainPassword: randomPassword,
        hashedPassword 
      });
    }
    
    // กรณีตรวจสอบรหัสผ่าน
    if (action === 'verify') {
      const { hashedPassword } = await req.json();
      if (!hashedPassword) {
        return NextResponse.json(
          { error: 'ต้องระบุรหัสผ่านที่เข้ารหัสแล้ว' },
          { status: 400 }
        );
      }
      
      const isValid = await bcrypt.compare(password, hashedPassword);
      return NextResponse.json({ isValid });
    }
    
    return NextResponse.json(
      { error: 'ไม่รู้จักการกระทำที่ระบุ' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Password API error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการจัดการรหัสผ่าน' },
      { status: 500 }
    );
  }
} 