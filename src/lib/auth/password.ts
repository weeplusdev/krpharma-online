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
 * เข้ารหัสรหัสผ่าน (เรียกผ่าน API)
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const response = await fetch('/api/auth/hash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.hashedPassword;
  } catch (error) {
    console.error('Failed to hash password:', error);
    throw new Error('ไม่สามารถเข้ารหัสรหัสผ่านได้');
  }
}

/**
 * ตรวจสอบรหัสผ่าน (เรียกผ่าน API)
 */
export async function verifyPassword(
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: plainPassword,
        hashedPassword,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.isValid;
  } catch (error) {
    console.error('Failed to verify password:', error);
    throw new Error('ไม่สามารถตรวจสอบรหัสผ่านได้');
  }
}
