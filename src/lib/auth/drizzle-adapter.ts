import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { accounts, sessions, users, verificationTokens, type User, type NewAccount } from '@/lib/db/schema';
import type { Adapter, AdapterSession, AdapterUser, VerificationToken } from 'next-auth/adapters';

export function DrizzleAdapter(): Adapter {
  return {
    async createUser(userData) {
      const [dbUser] = await db.insert(users).values({
        name: userData.name || '',
        email: userData.email || '',
        image: userData.image || null,
        emailVerified: userData.emailVerified || null,
        password: '', // ต้องกำหนดค่าเริ่มต้น
        role: 'user', // ค่าเริ่มต้นสำหรับผู้ใช้ใหม่
      }).returning();
      
      const adaptedUser: AdapterUser = {
        id: String(dbUser.id),
        name: dbUser.name,
        email: dbUser.email,
        emailVerified: dbUser.emailVerified,
        image: dbUser.image
      };
      
      return adaptedUser;
    },
    
    async getUser(id) {
      // ตรวจสอบว่า id มีค่าหรือไม่
      if (!id) return null;
      
      // พยายามแปลง id เป็นตัวเลข
      let numericId: number;
      try {
        numericId = Number(id);
        // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่
        if (isNaN(numericId) || numericId <= 0) return null;
      } catch (_) {
        console.error('Invalid user ID:', id);
        return null;
      }
      
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, numericId),
      });
      
      if (!dbUser) return null;
      
      const adaptedUser: AdapterUser = {
        id: String(dbUser.id),
        name: dbUser.name,
        email: dbUser.email,
        emailVerified: dbUser.emailVerified,
        image: dbUser.image
      };
      
      return adaptedUser;
    },
    
    async getUserByEmail(email) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      
      if (!dbUser) return null;
      
      const adaptedUser: AdapterUser = {
        id: String(dbUser.id),
        name: dbUser.name,
        email: dbUser.email,
        emailVerified: dbUser.emailVerified,
        image: dbUser.image
      };
      
      return adaptedUser;
    },
    
    async getUserByAccount({ providerAccountId, provider }) {
      try {
        // ใช้การ join แทนการใช้ with เพื่อหลีกเลี่ยงปัญหากับ referencedTable
        const records = await db
          .select({
            user: users,
            account: accounts
          })
          .from(accounts)
          .innerJoin(users, eq(accounts.userId, users.id))
          .where(
            and(
              eq(accounts.providerAccountId, providerAccountId),
              eq(accounts.provider, provider)
            )
          )
          .limit(1);
        
        if (!records.length || !records[0].user) return null;
        
        const user = records[0].user;
        
        const adaptedUser: AdapterUser = {
          id: String(user.id),
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image
        };
        
        return adaptedUser;
      } catch (error) {
        console.error("Error in getUserByAccount:", error);
        return null;
      }
    },
    
    async updateUser({ id, ...data }) {
      // ตรวจสอบว่า id มีค่าหรือไม่
      if (!id) throw new Error("User ID is required");
      
      // พยายามแปลง id เป็นตัวเลข
      let numericId: number;
      try {
        numericId = Number(id);
        // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่
        if (isNaN(numericId) || numericId <= 0) throw new Error("Invalid user ID");
      } catch (_) {
        console.error('Invalid user ID:', id);
        throw new Error("Invalid user ID format");
      }
      
      // กรองข้อมูลที่จะอัปเดต เอาเฉพาะที่อนุญาตให้อัปเดตได้
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.emailVerified !== undefined) updateData.emailVerified = data.emailVerified;
      if (data.image !== undefined) updateData.image = data.image || null;
      
      const [dbUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, numericId))
        .returning();
      
      const adaptedUser: AdapterUser = {
        id: String(dbUser.id),
        name: dbUser.name,
        email: dbUser.email,
        emailVerified: dbUser.emailVerified,
        image: dbUser.image
      };
      
      return adaptedUser;
    },
    
    async deleteUser(userId) {
      // ตรวจสอบว่า userId มีค่าหรือไม่
      if (!userId) return null;
      
      // พยายามแปลง userId เป็นตัวเลข
      let numericId: number;
      try {
        numericId = Number(userId);
        // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่
        if (isNaN(numericId) || numericId <= 0) return null;
      } catch (_) {
        console.error('Invalid user ID:', userId);
        return null;
      }
      
      const [dbUser] = await db
        .delete(users)
        .where(eq(users.id, numericId))
        .returning();
      
      if (!dbUser) return null;
      
      const adaptedUser: AdapterUser = {
        id: String(dbUser.id),
        name: dbUser.name,
        email: dbUser.email,
        emailVerified: dbUser.emailVerified,
        image: dbUser.image
      };
      
      return adaptedUser;
    },
    
    async linkAccount(account) {
      // ตรวจสอบว่า userId มีค่าและถูกต้องหรือไม่
      if (!account.userId) throw new Error("User ID is required");
      
      let numericUserId: number;
      try {
        numericUserId = Number(account.userId);
        if (isNaN(numericUserId) || numericUserId <= 0) throw new Error("Invalid user ID");
      } catch (_) {
        console.error('Invalid user ID in linkAccount:', account.userId);
        throw new Error("Invalid user ID format");
      }
      
      // แปลงค่าให้ตรงกับโครงสร้างของตาราง
      const accountData: NewAccount = {
        userId: numericUserId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token || null,
        access_token: account.access_token || null,
        expires_at: account.expires_at ? BigInt(account.expires_at) : null,
        token_type: account.token_type || null,
        scope: account.scope || null,
        id_token: account.id_token || null,
        session_state: account.session_state ? String(account.session_state) : null,
      };
      
      await db.insert(accounts).values(accountData);
    },
    
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        );
    },
    
    async createSession(data) {
      // ตรวจสอบว่า userId มีค่าและถูกต้องหรือไม่
      if (!data.userId) throw new Error("User ID is required");
      
      let numericUserId: number;
      try {
        numericUserId = Number(data.userId);
        if (isNaN(numericUserId) || numericUserId <= 0) throw new Error("Invalid user ID");
      } catch (_) {
        console.error('Invalid user ID in createSession:', data.userId);
        throw new Error("Invalid user ID format");
      }
      
      const sessionData = {
        id: crypto.randomUUID(),
        userId: numericUserId,
        sessionToken: data.sessionToken,
        expiresAt: data.expires,
      };
      
      const [dbSession] = await db
        .insert(sessions)
        .values(sessionData)
        .returning();
      
      const adaptedSession: AdapterSession = {
        userId: String(dbSession.userId),
        sessionToken: dbSession.sessionToken,
        expires: dbSession.expiresAt
      };
      
      return adaptedSession;
    },
    
    async getSessionAndUser(sessionToken) {
      try {
        // ใช้การ join แทนการใช้ with เพื่อหลีกเลี่ยงปัญหากับ referencedTable
        const records = await db
          .select({
            session: sessions,
            user: users
          })
          .from(sessions)
          .innerJoin(users, eq(sessions.userId, users.id))
          .where(eq(sessions.sessionToken, sessionToken))
          .limit(1);
        
        if (!records.length || !records[0].user || !records[0].session) return null;
        
        const session = records[0].session;
        const user = records[0].user;
        
        const adaptedSession: AdapterSession = {
          userId: String(session.userId),
          sessionToken: session.sessionToken,
          expires: session.expiresAt
        };
        
        const adaptedUser: AdapterUser = {
          id: String(user.id),
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image
        };
        
        return {
          session: adaptedSession,
          user: adaptedUser,
        };
      } catch (error) {
        console.error("Error in getSessionAndUser:", error);
        return null;
      }
    },
    
    async updateSession(data) {
      const [dbSession] = await db
        .update(sessions)
        .set({
          expiresAt: data.expires,
        })
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning();
      
      if (!dbSession) return null;
      
      const adaptedSession: AdapterSession = {
        userId: String(dbSession.userId),
        sessionToken: dbSession.sessionToken,
        expires: dbSession.expiresAt
      };
      
      return adaptedSession;
    },
    
    async deleteSession(sessionToken) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },
    
    async createVerificationToken(data) {
      const [dbToken] = await db
        .insert(verificationTokens)
        .values({
          identifier: data.identifier,
          token: data.token,
          expiresAt: data.expires,
        })
        .returning();
      
      const adaptedToken: VerificationToken = {
        identifier: dbToken.identifier,
        token: dbToken.token,
        expires: dbToken.expiresAt
      };
      
      return adaptedToken;
    },
    
    async useVerificationToken({ identifier, token }) {
      const [dbToken] = await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, identifier),
            eq(verificationTokens.token, token)
          )
        )
        .returning();
      
      if (!dbToken) return null;
      
      const adaptedToken: VerificationToken = {
        identifier: dbToken.identifier,
        token: dbToken.token,
        expires: dbToken.expiresAt
      };
      
      return adaptedToken;
    },
  };
} 