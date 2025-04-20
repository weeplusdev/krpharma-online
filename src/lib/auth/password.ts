import bcrypt from 'bcryptjs';

/**
 * สร้าง random bytes โดยใช้ Web Crypto API แทน crypto.randomBytes
 */
function generateRandomHexString(byteLength: number): string {
  const array = new Uint8Array(byteLength);
  globalThis.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * สร้างรหัสผ่านที่ปลอดภัยแบบสุ่ม
 */
export async function generateSecurePassword(): Promise<string> {
  const randomPassword = generateRandomHexString(16); // 16 bytes = 32 hex characters
  return await bcrypt.hash(randomPassword, 10);
}

/**
 * เข้ารหัสรหัสผ่าน
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * ตรวจสอบรหัสผ่าน
 */
export async function verifyPassword(
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
