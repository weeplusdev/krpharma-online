"\"use client"

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
import { useState, useEffect } from "react"

export function AuthStatus() {
  const { data: session, status } = useSession()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Button asChild>
        <Link href="/web/auth/signin">เข้าสู่ระบบ</Link>
      </Button>
    )
  }

  if (status === "loading") {
    return (
      <Button disabled>
        <User size={18} className="mr-2" />
        ก��ลังโหลด...
      </Button>
    )
  }

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
