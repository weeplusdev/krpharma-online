"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function AuthStatus() {
  const { data: session, status } = useSession()
  const [isClient, setIsClient] = useState(false)

  // ใช้ useEffect เพื่อตรวจสอบว่าโค้ดทำงานบน client หรือไม่
  useEffect(() => {
    setIsClient(true)
  }, [])

  // ถ้ายังไม่ได้ทำงานบน client ให้แสดงปุ่มเข้าสู่ระบบเท่านั้น
  if (!isClient) {
    return (
      <Button asChild>
        <Link href="/web/auth/signin">เข้าสู่ระบบ</Link>
      </Button>
    )
  }

  // ถ้ากำลังโหลดข้อมูล session ให้แสดงปุ่มเข้าสู่ระบบที่ถูก disable
  if (status === "loading") {
    return (
      <Button disabled>
        <User size={18} className="mr-2" />
        กำลังโหลด...
      </Button>
    )
  }

  // ถ้าล็อกอินแล้ว ให้แสดงเมนูผู้ใช้
  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <User size={18} />
            <span className="max-w-[100px] truncate">{session.user.name || "บัญชีของฉัน"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2">
            <p className="font-medium">{session.user.name}</p>
            <p className="text-sm text-muted-foreground truncate">{session.user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/web/account" className="cursor-pointer w-full">
              จัดการบัญชี
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/web/orders" className="cursor-pointer w-full">
              ประวัติการสั่งซื้อ
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/web" })} className="text-red-500 cursor-pointer">
            <LogOut size={16} className="mr-2" />
            ออกจากระบบ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // ถ้ายังไม่ได้ล็อกอิน ให้แสดงปุ่มเข้าสู่ระบบและลงทะเบียน
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" asChild>
        <Link href="/web/auth/signup">ลงทะเบียน</Link>
      </Button>
      <Button asChild>
        <Link href="/web/auth/signin">เข้าสู่ระบบ</Link>
      </Button>
    </div>
  )
}
