import Link from 'next/link';
import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'ลืมรหัสผ่าน | KR Pharma',
  description: 'ลืมรหัสผ่าน? เราสามารถช่วยคุณรีเซ็ตรหัสผ่านและเข้าสู่ระบบอีกครั้ง',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ลืมรหัสผ่าน
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ใส่อีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ForgotPasswordForm />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  หรือ
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                href="/auth/register"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                ลงทะเบียนใหม่
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 