'use client'

import dynamic from 'next/dynamic'

const AuthProvider = dynamic(() => import('@/components/auth-provider').then((m) => m.AuthProvider), { ssr: false })
const ThemeProvider = dynamic(() => import('@/components/theme-provider').then((m) => m.ThemeProvider), { ssr: false })
const PlatformProvider = dynamic(() => import('@/components/platform-detector').then((m) => m.PlatformProvider), {
  ssr: false,
})
const Toaster = dynamic(() => import('@/components/ui/sonner').then((m) => m.Toaster), { ssr: false })
const CartProvider = dynamic(() => import('@/context/cart-context').then((mod) => mod.CartProvider), { ssr: false })
const LiffProvider = dynamic(() => import('@/components/liff-provider').then((mod) => mod.LiffProvider), { ssr: false })

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="medpharma-theme">
        <PlatformProvider>
          <CartProvider>{children}</CartProvider>
        </PlatformProvider>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}

export function LiffProviders({ children }: { children: React.ReactNode }) {
  return (
    <LiffProvider>
      <CartProvider>{children}</CartProvider>
    </LiffProvider>
  )
}
