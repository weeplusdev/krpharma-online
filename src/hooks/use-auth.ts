'use client';

import { useSession } from 'next-auth/react';

/**
 * Hook สำหรับเข้าถึงข้อมูลการยืนยันตัวตนและสิทธิ์ของผู้ใช้
 * 
 * @example
 * const { user, isAuthenticated, hasPermission } = useAuth();
 * 
 * if (hasPermission('canViewDashboard')) {
 *   // แสดงแดชบอร์ด
 * }
 */
export function useAuth() {
  const { data: session, status } = useSession();
  
  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์ที่กำหนดหรือไม่
   */
  const hasPermission = (permission: string) => {
    return session?.user?.permissions?.includes(permission) || false;
  };
  
  /**
   * ตรวจสอบว่าผู้ใช้มีบทบาทที่กำหนดหรือไม่
   */
  const hasRole = (role: string | string[]) => {
    if (!session?.user?.role) return false;
    
    if (Array.isArray(role)) {
      return role.includes(session.user.role);
    }
    
    return session.user.role === role;
  };
  
  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    hasPermission,
    hasRole,
  };
}