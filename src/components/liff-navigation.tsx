"use client"

import { useRouter } from "next/navigation"

type LiffNavigationProps = {
  path: string
  params?: Record<string, string>
}

export function useLiffNavigation() {
  const router = useRouter()

  const navigateTo = ({ path, params = {} }: LiffNavigationProps) => {
    // ตรวจสอบว่าเปิดใน LIFF หรือไม่
    if (typeof window !== "undefined" && (window as any).liff) {
      const liff = (window as any).liff

      if (liff.isInClient()) {
        // ถ้าเปิดใน LIFF ให้ใช้ URL parameters
        const searchParams = new URLSearchParams()
        searchParams.append("path", path)

        // เพิ่ม parameters อื่นๆ
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, value)
        })

        // นำทางไปยังหน้าใหม่
        router.push(`/liff?${searchParams.toString()}`)
      } else {
        // ถ้าเปิดในเบราว์เซอร์ ให้นำทางโดยตรง
        const searchParams = new URLSearchParams(params)
        const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ""
        router.push(`/liff/${path}${queryString}`)
      }
    } else {
      // Fallback สำหรับกรณีที่ไม่ได้เปิดใน LIFF
      const searchParams = new URLSearchParams(params)
      const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ""
      router.push(`/liff/${path}${queryString}`)
    }
  }

  return { navigateTo }
}
