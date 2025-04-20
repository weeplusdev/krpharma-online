import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { accounts, sessions, users, verificationTokens, type User, type NewAccount } from '@/lib/db/schema';
import type { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from 'next-auth/adapters';

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
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, Number(id)),
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
      const result = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.providerAccountId, providerAccountId),
          eq(accounts.provider, provider)
        ),
        with: {
          user: true,
        },
      });
      
      if (!result || !result.user) return null;
      
      const user = result.user as User;
      
      const adaptedUser: AdapterUser = {
        id: String(user.id),
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image
      };
      
      return adaptedUser;
    },
    
    async updateUser({ id, ...data }) {
      if (!id) throw new Error("User ID is required");
      
      // กรองข้อมูลที่จะอัปเดต เอาเฉพาะที่อนุญาตให้อัปเดตได้
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.emailVerified !== undefined) updateData.emailVerified = data.emailVerified;
      if (data.image !== undefined) updateData.image = data.image || null;
      
      const [dbUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, Number(id)))
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
      const [dbUser] = await db
        .delete(users)
        .where(eq(users.id, Number(userId)))
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
      // แปลงค่าให้ตรงกับโครงสร้างของตาราง
      const accountData: NewAccount = {
        userId: Number(account.userId),
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
      const sessionData = {
        id: crypto.randomUUID(),
        userId: Number(data.userId),
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
      const result = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, sessionToken),
        with: {
          user: true,
        },
      });
      
      if (!result || !result.user) return null;
      
      const user = result.user as User;
      
      const adaptedSession: AdapterSession = {
        userId: String(result.userId),
        sessionToken: result.sessionToken,
        expires: result.expiresAt
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