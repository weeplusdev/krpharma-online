"use client"

import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLiffNavigation } from "@/lib/liff-navigation"

type LiffHeaderProps = {
  title?: string
  backUrl?: string
}

export function LiffHeader({ title = "MedPharma", backUrl }: LiffHeaderProps) {
  const { navigateTo, closeWindow } = useLiffNavigation()

  const handleBack = () => {
    if (backUrl) {
      navigateTo({ path: backUrl })
    } else {
      closeWindow()
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="container px-4 h-14 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-medium truncate max-w-[200px]">{title}</h1>
        <div className="w-5"></div> {/* Spacer for alignment */}
      </div>
    </header>
  )
}
