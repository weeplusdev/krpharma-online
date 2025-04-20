import type { NextAuthConfig } from "next-auth"
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

/**
 * กำหนดค่า NextAuthConfig ให้ถูกต้องตามรูปแบบที่ next-auth v5 รองรับ
 */
export const authConfig = {
  callbacks: {
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'customer';
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    // เพิ่มหน้าลงทะเบียนสำหรับบุคลากรทางการแพทย์และเภสัชกร
    newUser: '/auth/register',
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [],
} satisfies NextAuthConfig;