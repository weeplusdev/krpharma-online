'use client';

import { useAuth } from '@/hooks/use-auth';
import { ReactNode } from 'react';

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * คอมโพเนนต์สำหรับแสดงหรือซ่อนอิลิเมนต์ตามสิทธิ์ของผู้ใช้
 * 
 * @example
 * <PermissionGuard permission="canViewATC">
 *   <ATCContentComponent />
 * </PermissionGuard>
 */
export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { user } = useAuth();
  
  if (!user || !user.permissions?.includes(permission)) {
    return fallback;
  }
  
  return children;
}