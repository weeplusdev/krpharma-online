"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { usePlatform } from "@/components/platform-detector"
import { useEffect, useState } from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLiff } = usePlatform()
  const [isLiffInitialized, setIsLiffInitialized] = useState(!isLiff)

  useEffect(() => {
    // ถ้าเป็น LIFF ให้เริ่มต้น LIFF SDK
    if (isLiff && typeof window !== "undefined") {
      const initializeLiff = async () => {
        try {
          const liffId = process.env.NEXT_PUBLIC_LIFF_ID
          if (!liffId) {
            throw new Error("LIFF ID is not defined")
          }

          const liff = (await import("@line/liff")).default
          await liff.init({ liffId })

          // ถ้า LIFF login แล้ว ให้ส่งข้อมูลไปยัง API
          if (liff.isLoggedIn()) {
            const profile = await liff.getProfile()
            const token = liff.getAccessToken()

            await fetch("/api/auth/liff-login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ profile, token }),
            })
          }

          setIsLiffInitialized(true)
        } catch (error) {
          console.error("LIFF initialization error:", error)
          setIsLiffInitialized(true) // ตั้งค่าเป็น true เพื่อให้แสดงเนื้อหาแม้จะมีข้อผิดพลาด
        }
      }

      initializeLiff()
    }
  }, [isLiff])

  // รอจนกว่า LIFF จะเริ่มต้นเสร็จ
  if (!isLiffInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    )
  }

  return <SessionProvider>{children}</SessionProvider>
}
