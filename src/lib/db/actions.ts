import { db } from './index';
import { users, NewUser, User } from './schema';
import { eq } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';

/**
 * ค้นหาผู้ใช้จากอีเมล
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return result[0];
}

/**
 * ค้นหาผู้ใช้จากไอดี
 */
export async function getUserById(id: number): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  
  return result[0];
}

/**
 * สร้างผู้ใช้ใหม่
 */
export async function createUser(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await hash(userData.password, 10);
  
  const newUser = {
    ...userData,
    password: hashedPassword,
  };
  
  const result = await db.insert(users).values(newUser).returning();
  
  return result[0];
}

/**
 * ตรวจสอบรหัสผ่าน
 */
export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * อัปเดตข้อมูลผู้ใช้
 */
export async function updateUser(id: number, userData: Partial<NewUser>): Promise<User | undefined> {
  // ถ้ามีการอัปเดตรหัสผ่าน ให้เข้ารหัสก่อน
  if (userData.password) {
    userData.password = await hash(userData.password, 10);
  }
  
  const result = await db
    .update(users)
    .set({
      ...userData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  
  return result[0];
} 