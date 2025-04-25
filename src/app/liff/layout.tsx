import type React from "react"
import { LiffProviders } from "../providers"
import { LiffLoadingScreen } from "@/components/liff-loading-screen"

export default function LiffLayout({ children }: { children: React.ReactNode }) {
  return (
    <LiffProviders>
      <LiffLoadingScreen>{children}</LiffLoadingScreen>
    </LiffProviders>
  )
}
