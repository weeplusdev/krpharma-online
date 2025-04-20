/**
 * สร้างรหัสผ่านที่ปลอดภัยแบบสุ่ม (เรียกผ่าน API)
 */
export async function generateSecurePassword(): Promise<string> {
  const response = await fetch('/api/auth/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'generate' }),
  });
  
  if (!response.ok) {
    throw new Error('ไม่สามารถสร้างรหัสผ่านได้');
  }
  
  const data = await response.json();
  return data.hashedPassword;
}

/**
 * เข้ารหัสรหัสผ่าน (เรียกผ่าน API)
 */
export async function hashPassword(password: string): Promise<string> {
  const response = await fetch('/api/auth/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'hash', password }),
  });
  
  if (!response.ok) {
    throw new Error('ไม่สามารถเข้ารหัสรหัสผ่านได้');
  }
  
  const data = await response.json();
  return data.hashedPassword;
}

/**
 * ตรวจสอบรหัสผ่าน (เรียกผ่าน API)
 */
export async function verifyPassword(
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> {
  const response = await fetch('/api/auth/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'verify',
      password: plainPassword,
      hashedPassword,
    }),
  });
  
  if (!response.ok) {
    throw new Error('ไม่สามารถตรวจสอบรหัสผ่านได้');
  }
  
  const data = await response.json();
  return data.isValid;
}
