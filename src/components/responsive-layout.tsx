"use client"

import type React from "react"

import { usePlatform } from "@/components/platform-detector"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useState, useEffect } from "react"

type ResponsiveLayoutProps = {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  title?: string
  backUrl?: string
}

export function ResponsiveLayout({
  children,
  showHeader = true,
  showFooter = true,
  title,
  backUrl,
}: ResponsiveLayoutProps) {
  const { isLiff, isWeb } = usePlatform()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && <Header />}

      <main className="flex-1">
        <div className={isLiff ? "container px-4 py-4" : ""}>{children}</div>
      </main>

      {showFooter && isWeb && <Footer />}
    </div>
  )
}
