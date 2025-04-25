"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function LiffRouter({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // ฟังก์ชันสำหรับเริ่มต้น LIFF และจัดการ URL parameters
    const initializeLiff = async () => {
      try {
        // ในสภาพแวดล้อมจริง คุณจะต้องใช้ LIFF ID ของคุณเอง
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID

        // ตรวจสอบว่ามี window.liff หรือไม่
        if (typeof window !== "undefined") {
          // โหลด LIFF SDK
          const liff = (await import("@line/liff")).default

          // เริ่มต้น LIFF
          await liff.init({ liffId })

          // ตรวจสอบว่าเปิดใน LINE หรือไม่
          if (!liff.isInClient() && !liff.isLoggedIn()) {
            // ถ้าเปิดในเบราว์เซอร์และยังไม่ได้ล็อกอิน ให้ล็อกอิน
            liff.login({ redirectUri: window.location.href })
            return
          }

          // ดึง URL parameters จาก LIFF
          const params = new URLSearchParams(window.location.search)
          const path = params.get("path")

          // ถ้ามี path parameter ให้นำทางไปยังหน้านั้น
          if (path && pathname === "/liff") {
            router.push(`/liff/${path}`)
          }

          setIsInitialized(true)
        }
      } catch (error) {
        console.error("ไม่สามารถเริ่มต้น LIFF ได้:", error)
        setIsInitialized(true) // ยังคงแสดงเนื้อหาแม้จะมีข้อผิดพลาด
      }
    }

    initializeLiff()
  }, [pathname, router])

  // แสดง loading state ระหว่างรอ LIFF initialize
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}
