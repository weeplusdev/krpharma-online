"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLiff } from "@/components/liff-provider"

export default function LiffIndexPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isReady } = useLiff()

  useEffect(() => {
    if (!isReady) return

    // ตรวจสอบ URL parameters
    const path = searchParams.get("path")

    // ถ้ามี path parameter ให้นำทางไปยังหน้านั้น
    if (path) {
      router.push(`/liff/${path}`)
    } else {
      // ถ้าไม่มี path parameter ให้นำทางไปยังหน้าหลัก (เช่น products)
      router.push("/liff/products")
    }
  }, [isReady, router, searchParams])

  // แสดง loading state
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
    </div>
  )
}
