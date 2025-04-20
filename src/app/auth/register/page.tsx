import Link from 'next/link';
import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'ลงทะเบียน | KR Pharma',
  description: 'สร้างบัญชีใหม่เพื่อเข้าถึงบริการทั้งหมดของ KR Pharma ได้อย่างสะดวกรวดเร็ว',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          สร้างบัญชีใหม่
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          หรือ{' '}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            เข้าสู่ระบบด้วยบัญชีที่มีอยู่แล้ว
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  โดยการลงทะเบียน คุณยอมรับ
                </span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                เงื่อนไขการใช้บริการ
              </Link>
              {' และ '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                นโยบายความเป็นส่วนตัว
              </Link>
              {' ของเรา'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 