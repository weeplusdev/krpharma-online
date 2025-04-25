"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { usePlatform } from "@/components/platform-detector"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const { login } = useAuth()
  const { isLiff } = usePlatform()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      router.push(callbackUrl)
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ")
      setIsLoading(false)
    }
  }

  const handleLineLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      await login("line")
      router.push(callbackUrl)
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย LINE")
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>เข้าสู่ระบบ</CardTitle>
            <CardDescription>เข้าสู่ระบบเพื่อจัดการบัญชีและดูประวัติการสั่งซื้อ</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLiff && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email">อีเมล</label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password">รหัสผ่าน</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>
              </form>
            )}

            <div className={!isLiff ? "mt-6" : ""}>
              <div className={!isLiff ? "relative" : ""}>
                {!isLiff && (
                  <>
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">หรือ</span>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleLineLogin}
                  className="w-full mt-4 bg-[#06C755] hover:bg-[#06C755]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย LINE"}
                </Button>
              </div>
            </div>

            {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
          </CardContent>
          {!isLiff && (
            <CardFooter>
              <div className="text-sm text-center w-full">
                ยังไม่มีบัญชี?{" "}
                <Link href="/web/auth/signup" className="text-primary hover:underline">
                  สมัครสมาชิก
                </Link>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
