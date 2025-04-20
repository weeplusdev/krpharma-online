import { users, accounts, type UserRole } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

// ส่งออกฟังก์ชัน verifyPassword เพื่อให้ไฟล์อื่นสามารถใช้งานได้
export { verifyPassword };

/**
 * ค้นหาผู้ใช้จาก Line ID
 */
export async function getUserByLineId(lineId: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.lineId, lineId)
  });
  
  return result;
}

/**
 * ค้นหาผู้ใช้จากอีเมล
 */
export async function getUserByEmail(email: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.email, email)
  });
  
  return result;
}

/**
 * สร้างผู้ใช้ใหม่จากข้อมูล Line
 */
export async function createUserFromLine(userData: {
  name: string;
  email: string;
  lineId: string;
  image?: string;
  role: UserRole;
}) {
  // สร้างรหัสผ่านสุ่มสำหรับผู้ใช้ใหม่ (อาจไม่จำเป็นถ้าใช้ Line Login อย่างเดียว)
  const randomPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await hashPassword(randomPassword);
  
  // สร้างผู้ใช้ใหม่
  const [newUser] = await db.insert(users).values({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    lineId: userData.lineId,
    image: userData.image,
    role: userData.role as UserRole,
  }).returning();
  
  // สร้างบัญชี Line ในตาราง accounts
  await db.insert(accounts).values({
    userId: newUser.id,
    type: 'oauth',
    provider: 'line',
    providerAccountId: userData.lineId,
    // ไม่จำเป็นต้องเก็บ tokens ทั้งหมดเนื่องจาก NextAuth จะจัดการให้
  });
  
  return newUser;
}

/**
 * เชื่อมโยงบัญชี Line กับบัญชีที่มีอยู่แล้ว
 */
export async function linkLineToExistingUser(userId: number, lineId: string, lineProfile: { picture?: string }) {
  // อัปเดตข้อมูลผู้ใช้
  const [updatedUser] = await db
    .update(users)
    .set({
      lineId: lineId,
      image: lineProfile.picture || undefined,
    })
    .where(eq(users.id, userId))
    .returning();
  
  // สร้างบัญชี Line ในตาราง accounts
  await db.insert(accounts).values({
    userId: userId,
    type: 'oauth',
    provider: 'line',
    providerAccountId: lineId,
  });
  
  return updatedUser;
}