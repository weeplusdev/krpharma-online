"use client"

import type React from "react"

import { useLiff } from "@/components/liff-provider"

export function LiffLoadingScreen({ children }: { children: React.ReactNode }) {
  const { isReady, error } = useLiff()

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md p-6 text-center">
          <h2 className="text-xl font-bold mb-4">เกิดข้อผิดพลาด</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <p className="text-sm text-muted-foreground">กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบหากปัญหายังคงอยู่</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
