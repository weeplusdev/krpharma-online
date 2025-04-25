"use client"

import { useRouter } from "next/navigation"
import { useLiff } from "@/components/liff-provider"

type NavigateToOptions = {
  path: string
  params?: Record<string, string>
}

export function useLiffNavigation() {
  const router = useRouter()
  const { liff, isInClient } = useLiff()

  const navigateTo = ({ path, params = {} }: NavigateToOptions) => {
    // สร้าง URL parameters
    const searchParams = new URLSearchParams()

    // เพิ่ม parameters
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value)
    })

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ""

    // ถ้าเปิดใน LIFF Client และต้องการเปิด URL ภายนอก
    if (isInClient && path.startsWith("http")) {
      liff.openWindow({
        url: path,
        external: true,
      })
      return
    }

    // ถ้าเปิดใน LIFF Client และต้องการเปิด URL ภายใน
    router.push(`/liff/${path}${queryString}`)
  }

  const closeWindow = () => {
    if (isInClient) {
      liff.closeWindow()
    } else {
      router.back()
    }
  }

  return { navigateTo, closeWindow }
}
