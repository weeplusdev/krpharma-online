import { auth } from '@/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center">KR Pharma Online</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          {session ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">ยินดีต้อนรับ, {session.user?.name || 'ผู้ใช้งาน'}</h2>
              <p className="text-gray-600">บทบาท: {session.user?.role || 'ผู้ใช้ทั่วไป'}</p>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">สิทธิ์การใช้งาน:</h3>
                {session.user?.permissions ? (
                  <ul className="list-disc pl-5">
                    {session.user.permissions.map((permission, index) => (
                      <li key={index} className="text-gray-700">{permission}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">ไม่มีสิทธิ์พิเศษ</p>
                )}
              </div>
              
              <div className="pt-4">
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    ออกจากระบบ
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-semibold">ยังไม่ได้เข้าสู่ระบบ</h2>
              <p className="text-gray-600">กรุณาเข้าสู่ระบบเพื่อใช้งานเว็บไซต์</p>
              <div className="pt-4 space-x-4">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  ลงทะเบียน
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">เมนูหลัก</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link 
              href="/products" 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              สินค้าทั่วไป
            </Link>
            <Link 
              href="/general-drugs" 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              ยาสามัญ
            </Link>
            <Link 
              href="/atc" 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              ค้นหายาด้วย ATC
            </Link>
            <Link 
              href="/prescription" 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              ใบสั่งยา
            </Link>
            <Link 
              href="/dashboard" 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              แดชบอร์ด
            </Link>
            <Link 
              href="/inventory" 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              จัดการสต็อก
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}