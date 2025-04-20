import { compare, hash } from 'bcryptjs';

/**
 * สร้างรหัสผ่านที่ปลอดภัยแบบสุ่ม (เรียกผ่าน API)
 */
export async function generateSecurePassword(): Promise<string> {
  try {
    const response = await fetch('/api/auth/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.hashedPassword;
  } catch (error) {
    console.error('Failed to generate secure password:', error);
    throw new Error('ไม่สามารถสร้างรหัสผ่านได้');
  }
}

/**
 * เข้ารหัสรหัสผ่าน
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await hashPasswordDirect(password);
  } catch (error) {
    console.error('Failed to hash password:', error);
    throw new Error('ไม่สามารถเข้ารหัสรหัสผ่านได้');
  }
}

/**
 * เข้ารหัสรหัสผ่านโดยใช้ bcryptjs โดยตรง
 */
export async function hashPasswordDirect(password: string, saltRounds: number = 10): Promise<string> {
  try {
    return await hash(password, saltRounds);
  } catch (error) {
    console.error('Failed to hash password directly:', error);
    throw new Error('ไม่สามารถเข้ารหัสรหัสผ่านได้');
  }
}

/**
 * ตรวจสอบรหัสผ่านโดยใช้ bcryptjs โดยตรง
 */
export async function verifyPassword(
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> {
  try {
    return await compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Failed to verify password:', error);
    return false;
  }
}
