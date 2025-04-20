import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import LineProvider from "next-auth/providers/line";
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from "@/lib/auth/drizzle-adapter";
import { handleLineCallback } from "@/lib/auth/line-provider";
import { getUserByEmail, verifyPassword } from '@/lib/db/actions';
import { UserRole } from "@/lib/db/schema";

// กำหนดสิทธิ์ตามบทบาท
type RolePermissions = Record<UserRole, string[]>;

export const rolePermissions: RolePermissions = {
  admin: ['canManageUsers', 'canViewDashboard', 'canManagePermissions'],
  pharmacist: ['canViewATC', 'canCreatePrescription', 'canSellGeneralProducts'],
  medic: ['canViewATC', 'canCreatePrescription', 'canSellGeneralProducts'],
  stock: ['canManageInventory', 'canViewStock', 'canUpdateStock'],
  seller: ['canManageInvoices', 'canManageDelivery', 'canSellGeneralProducts'],
  customer: ['canBuyGeneralDrugs', 'canViewGeneralProducts'],
  user: ['canBuyGeneralDrugs', 'canViewGeneralProducts'],
  doctor: ['canViewATC', 'canCreatePrescription', 'canSellGeneralProducts'],
};

// ฟังก์ชันตรวจสอบสิทธิ์
export function hasPermission(role: UserRole, permission: string): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}

// กำหนดค่าสำหรับ NextAuth
const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(),
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    newUser: '/auth/register',
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [],
  callbacks: {
    // ตรวจสอบสิทธิ์การเข้าถึงเส้นทาง
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role as UserRole || 'customer';
      
      // กำหนดกฎการเข้าถึงตามพาธและบทบาท
      if (nextUrl.pathname.startsWith('/dashboard')) {
        return isLoggedIn && userRole === 'admin';
      }
      
      if (nextUrl.pathname.startsWith('/admin')) {
        return isLoggedIn && userRole === 'admin';
      }
      
      if (nextUrl.pathname.startsWith('/atc') || nextUrl.pathname.startsWith('/prescription')) {
        return isLoggedIn && (userRole === 'pharmacist' || userRole === 'medic' || userRole === 'doctor');
      }
      
      if (nextUrl.pathname.startsWith('/inventory')) {
        return isLoggedIn && userRole === 'stock';
      }
      
      if (nextUrl.pathname.startsWith('/invoice') || nextUrl.pathname.startsWith('/delivery')) {
        return isLoggedIn && userRole === 'seller';
      }
      
      // หน้าทั่วไปให้เข้าถึงได้
      return true;
    },
    
    // เพิ่มข้อมูลในเซสชัน
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as UserRole;
        
        // เพิ่มข้อมูลสิทธิ์เข้าไปในเซสชัน
        session.user.permissions = token.role ? 
          rolePermissions[token.role as UserRole] : 
          rolePermissions.customer;
      }
      return session;
    },
    
    // อัปเดต token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'customer';
      }
      return token;
    },
    
    // การเข้าสู่ระบบด้วย Line
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
  },
};

// สร้าง NextAuth instance และส่งออกฟังก์ชันที่จำเป็น
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
});