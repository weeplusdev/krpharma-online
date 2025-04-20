import NextAuth from "next-auth";
import LineProvider from "next-auth/providers/line";
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from "@/auth.config";
import { handleLineCallback } from "@/lib/auth/line-provider";
import { getUserByEmail, verifyPassword } from '@/lib/db/actions';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "อีเมล", type: "email" },
        password: { label: "รหัสผ่าน", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // ค้นหาผู้ใช้จากอีเมล
        const user = await getUserByEmail(credentials.email as string);
        
        // ถ้าไม่พบผู้ใช้
        if (!user) return null;
        
        // ตรวจสอบรหัสผ่าน
        const isPasswordValid = await verifyPassword(user.password, credentials.password as string);
        
        if (!isPasswordValid) return null;
        
        // ส่งคืนข้อมูลผู้ใช้ (ไม่รวมรหัสผ่าน)
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image || null,
        };
      },
    }),
  ],
  callbacks: {
    // เพิ่ม callback สำหรับ Line Login
    async signIn({ account, profile, user }) {
      // สำหรับ Line Login
      if (account?.provider === "line" && profile) {
        const lineUser = await handleLineCallback({
          sub: profile.sub as string,
          name: profile.name || undefined,
          email: profile.email || undefined,
          picture: profile.picture || undefined
        }, {
          access_token: account.access_token,
          refresh_token: account.refresh_token,
        });
        
        // อัปเดตข้อมูลผู้ใช้จาก Line
        if (lineUser) {
          user.id = lineUser.id.toString();
          user.name = lineUser.name;
          user.email = lineUser.email || user.email;
          user.image = lineUser.image || user.image;
          user.role = lineUser.role;
        }
      }
      
      return true;
    },
    
    // นำ callbacks เดิมของ authConfig มาใช้
    ...authConfig.callbacks,
  },
});