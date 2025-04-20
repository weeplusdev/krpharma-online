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
              <div className="flex space-x-2">
                <Link
                  href="/auth/login"
                  className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
                >
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