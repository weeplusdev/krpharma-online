"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type LiffContextType = {
  liff: any | null
  isInClient: boolean
  isLoggedIn: boolean
  isReady: boolean
  error: Error | null
  profile: any | null
}

const LiffContext = createContext<LiffContextType>({
  liff: null,
  isInClient: false,
  isLoggedIn: false,
  isReady: false,
  error: null,
  profile: null,
})

export function useLiff() {
  return useContext(LiffContext)
}

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const [liffObject, setLiffObject] = useState<any | null>(null)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // ฟังก์ชันสำหรับเริ่มต้น LIFF
    const initializeLiff = async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID

        if (!liffId) {
          console.error("LIFF ID is missing")
          throw new Error("LIFF ID is required")
        }

        console.log("Initializing LIFF with ID:", liffId)

        // โหลด LIFF SDK
        const liff = (await import("@line/liff")).default

        // เพิ่ม logging
        console.log("LIFF SDK loaded, initializing...")

        // เริ่มต้น LIFF ด้วย debug mode
        await liff.init(
          {
            liffId,
            withLoginOnExternalBrowser: true, // เพิ่มตัวเลือกนี้
          },
          () => {
            console.log("LIFF initialization completed successfully")
          },
          (err) => {
            console.error("LIFF initialization failed", err)
          },
        )

        console.log("LIFF initialized, checking login status...")
        console.log("Is in client:", liff.isInClient())
        console.log("Is logged in:", liff.isLoggedIn())

        // ตรวจสอบว่าเปิดใน LINE หรือไม่
        if (!liff.isInClient() && !liff.isLoggedIn()) {
          // ถ้าเปิดในเบราว์เซอร์และยังไม่ได้ล็อกอิน ให้ล็อกอิน
          console.log("Not in LINE client and not logged in, redirecting to login...")
          liff.login({ redirectUri: window.location.href })
          return
        }

        // ดึงข้อมูลโปรไฟล์
        if (liff.isLoggedIn()) {
          console.log("User is logged in, getting profile...")
          const profile = await liff.getProfile()
          console.log("Profile retrieved:", profile)
          setProfile(profile)
        }

        // ตรวจสอบ path parameter
        const path = searchParams.get("path")
        if (path && pathname === "/liff") {
          // ถ้ามี path parameter ให้นำทางไปยังหน้านั้น
          console.log("Redirecting to path:", path)
          router.push(`/liff/${path}`)
        }

        setLiffObject(liff)
        setIsReady(true)
      } catch (err) {
        console.error("LIFF initialization failed with details:", err)
        setError(err as Error)
        setIsReady(true) // ยังคงแสดงเนื้อหาแม้จะมีข้อผิดพลาด
      }
    }

    // เริ่มต้น LIFF เฉพาะเมื่ออยู่ในหน้า LIFF
    if (pathname.startsWith("/liff")) {
      initializeLiff()
    } else {
      setIsReady(true)
    }
  }, [pathname, router, searchParams])

  const value = {
    liff: liffObject,
    isInClient: liffObject?.isInClient() || false,
    isLoggedIn: liffObject?.isLoggedIn() || false,
    isReady,
    error,
    profile,
  }

  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>
}
