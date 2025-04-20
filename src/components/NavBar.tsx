import Link from "next/link";
import { auth } from "@/auth";
import { UserRole } from "@/lib/db/schema";

export default async function NavBar() {
  const session = await auth();
  const userRole = session?.user?.role as UserRole || 'customer';

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="font-bold text-xl text-blue-600">
                KR Pharma
              </Link>
            </div>
            <div className="ml-6 flex space-x-4">
              {/* เมนูสำหรับผู้ใช้ทุกคน */}
              <Link href="/products" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                สินค้าทั่วไป
              </Link>
              
              {(userRole === 'customer' || userRole === 'pharmacist' || userRole === 'medic') && (
                <Link href="/general-drugs" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                  ยาสามัญ
                </Link>
              )}
              
              {/* เมนูสำหรับเภสัชกรและบุคลากรทางการแพทย์ */}
              {(userRole === 'pharmacist' || userRole === 'medic') && (
                <>
                  <Link href="/atc" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                    ค้นหายาด้วย ATC
                  </Link>
                  <Link href="/prescription" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                    ใบสั่งยา
                  </Link>
                </>
              )}
              
              {/* เมนูสำหรับผู้ดูแลสต็อก */}
              {userRole === 'stock' && (
                <Link href="/inventory" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                  จัดการสต็อก
                </Link>
              )}
              
              {/* เมนูสำหรับผู้ขาย */}
              {userRole === 'seller' && (
                <>
                  <Link href="/invoice" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                    ใบแจ้งหนี้
                  </Link>
                  <Link href="/delivery" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                    การจัดส่ง
                  </Link>
                </>
              )}
              
              {/* เมนูสำหรับผู้ดูแลระบบ */}
              {userRole === 'admin' && (
                <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                  แดชบอร์ด
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user?.name || 'ผู้ใช้งาน'}
                  {userRole && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({userRole === 'admin' ? 'ผู้ดูแลระบบ' : 
                        userRole === 'pharmacist' ? 'เภสัชกร' :
                        userRole === 'medic' ? 'บุคลากรทางการแพทย์' :
                        userRole === 'stock' ? 'ผู้ดูแลสต็อก' :
                        userRole === 'seller' ? 'ผู้ขาย' : 'ลูกค้า'})
                    </span>
                  )}
                </span>
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                  >
                    ออกจากระบบ
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  href="/auth/login"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md border-2 border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                    <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  ลงทะเบียน
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 