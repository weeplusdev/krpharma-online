"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ResponsiveLayout } from "@/components/responsive-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("เกิดข้อผิดพลาดในการเข้าสู่ระบบ")

  useEffect(() => {
    // ดึงข้อมูล error จาก URL parameters
    const error = searchParams.get("error")

    // กำหนดข้อความแสดงข้อผิดพลาดตามประเภทของ error
    if (error) {
      switch (error) {
        case "Signin":
          setErrorMessage("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง")
          break
        case "CredentialsSignin":
          setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง คุณอาจยังไม่ได้ลงทะเบียน")
          break
        case "SessionRequired":
          setErrorMessage("กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้")
          break
        default:
          setErrorMessage("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง")
      }
    }
  }, [searchParams])

  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle size={20} />
                <CardTitle>เกิดข้อผิดพลาด</CardTitle>
              </div>
              <CardDescription>มีข้อผิดพลาดเกิดขึ้นในระหว่างการเข้าสู่ระบบ</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">{errorMessage}</p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/web/auth/signin">เข้าสู่ระบบ</Link>
              </Button>
              <Button asChild>
                <Link href="/web/auth/signup">ลงทะเบียน</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  )
}
