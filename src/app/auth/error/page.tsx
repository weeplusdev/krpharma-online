'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // ฟังก์ชันแปลงรหัสข้อผิดพลาดเป็นข้อความภาษาไทย
  const getErrorMessage = (errorCode: string | null): string => {
    switch (errorCode) {
      case 'incorrect_credentials':
        return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      case 'login_failed':
        return 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง';
      case 'line_login_failed':
        return 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย LINE กรุณาลองใหม่อีกครั้ง';
      case 'OAuthAccountNotLinked':
        return 'อีเมลนี้ถูกใช้ด้วยวิธีการเข้าสู่ระบบอื่นแล้ว กรุณาเข้าสู่ระบบด้วยวิธีเดิมที่ใช้ก่อนหน้านี้';
      case 'CredentialsSignin':
        return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      default:
        return 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง';
    }
  };

  // ฟังก์ชันแสดงไอคอนตามประเภทข้อผิดพลาด
  const getErrorIcon = () => {
    return (
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <svg
          className="h-6 w-6 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {getErrorIcon()}
            <h3 className="mt-5 text-lg font-medium text-gray-900">เกิดข้อผิดพลาด</h3>
            <div className="mt-3 mb-6 text-sm text-gray-500">
              {getErrorMessage(error)}
            </div>
            <div className="mt-5 space-y-2">
              <Link
                href="/auth/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
              <Link
                href="/"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                กลับไปหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 