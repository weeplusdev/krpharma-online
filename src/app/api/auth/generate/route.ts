import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

/**
 * สร้าง random bytes โดยใช้ Web Crypto API
 */
function generateRandomHexString(byteLength: number): string {
  const array = new Uint8Array(byteLength);
  // ใช้ globalThis.crypto.getRandomValues() จาก Web Crypto API
  // ซึ่งสามารถใช้ได้ทั้งใน Node.js และ browser
  globalThis.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * API สำหรับสร้างรหัสผ่านสุ่มและ hash
 */
export async function POST() {
  try {
    const randomPassword = generateRandomHexString(16);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
    return NextResponse.json({ 
      plainPassword: randomPassword,
      hashedPassword 
    });
  } catch (error) {
    console.error('Password generate API error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างรหัสผ่าน' },
      { status: 500 }
    );
  }
} 