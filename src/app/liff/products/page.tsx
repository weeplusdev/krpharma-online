"use client"

import { ResponsiveLayout } from "@/components/responsive-layout"
import { ProductList } from "@/components/product-list"
import { useLiff } from "@/components/liff-provider"

export default function LiffProductsPage() {
  const { profile } = useLiff()

  return (
    <ResponsiveLayout title="สินค้าทั้งหมด" showFooter={false}>
      {profile && (
        <div className="mb-4 p-3 bg-primary/10 rounded-lg">
          <p className="text-sm">สวัสดี, {profile.displayName}</p>
        </div>
      )}
      <ProductList isLiff={true} />
    </ResponsiveLayout>
  )
}
