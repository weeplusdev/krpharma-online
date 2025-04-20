import { db } from '@/lib/db';
import { users, accounts, UserRole } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateSecurePassword } from '@/lib/auth/password';

interface LineProfile {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}

interface LineTokens {
  access_token?: string;
  refresh_token?: string;
}

export async function handleLineCallback(profile: LineProfile, tokens: LineTokens) {
  try {
    // ตรวจสอบว่ามี Line ID ในระบบหรือไม่
    const existingUser = await db.query.users.findFirst({
      where: eq(users.lineId, profile.sub)
    });

    // ถ้ามีผู้ใช้อยู่แล้ว
    if (existingUser) {
      // อัปเดต tokens สำหรับบัญชี Line
      try {
        // ใช้ select แทน query เพื่อป้องกันปัญหากับความสัมพันธ์
        const existingAccountResult = await db
          .select()
          .from(accounts)
          .where(
            and(
              eq(accounts.provider, 'line'),
              eq(accounts.providerAccountId, profile.sub)
            )
          )
          .limit(1);
        
        const existingAccount = existingAccountResult[0];

        if (existingAccount) {
          await db.update(accounts)
            .set({
              access_token: tokens.access_token || existingAccount.access_token,
              refresh_token: tokens.refresh_token || existingAccount.refresh_token,
            })
            .where(
              and(
                eq(accounts.provider, 'line'),
                eq(accounts.providerAccountId, profile.sub)
              )
            );
        } else {
          // สร้าง account ใหม่ถ้ายังไม่มี
          await db.insert(accounts).values({
            userId: existingUser.id,
            type: 'oauth',
            provider: 'line',
            providerAccountId: profile.sub,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          });
        }
      } catch (error) {
        console.error("Error updating Line account:", error);
        // ดำเนินการต่อแม้จะมีข้อผิดพลาดในการอัปเดต token
      }
      
      return existingUser;
    }

    // ถ้าไม่มีผู้ใช้ ให้สร้างผู้ใช้ใหม่
    const securePassword = await generateSecurePassword();
    
    const newUser = await db.insert(users).values({
      name: profile.name || `Line User ${profile.sub.substring(0, 8)}`,
      email: profile.email || `user-${profile.sub.substring(0, 8)}@example.com`,
      password: securePassword,
      role: 'customer' as UserRole,
      image: profile.picture,
      lineId: profile.sub,
    }).returning();

    // สร้าง account สำหรับ Line
    if (newUser[0]) {
      try {
        await db.insert(accounts).values({
          userId: newUser[0].id,
          type: 'oauth',
          provider: 'line',
          providerAccountId: profile.sub,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });
      } catch (error) {
        console.error("Error creating Line account:", error);
        // ดำเนินการต่อแม้จะมีข้อผิดพลาดในการสร้าง account
      }
    }

    return newUser[0];
  } catch (error) {
    console.error("Line callback error:", error);
    throw new Error("ไม่สามารถเชื่อมต่อกับ Line ได้");
  }
}