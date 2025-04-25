import { ResponsiveLayout } from "@/components/responsive-layout"
import { ProductList } from "@/components/product-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WebIndexPage() {
  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">KR Pharma - ร้านขายยาออนไลน์</h1>
            <p className="text-xl text-muted-foreground mb-6">
              ร้านขายยาออนไลน์ที่ให้บริการด้านสุขภาพครบวงจร พร้อมจัดส่งถึงบ้านทั่วประเทศ
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/web/products">ดูสินค้าทั้งหมด</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/web/auth/signin">เข้าสู่ระบบ</Link>
              </Button>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">สินค้าแนะนำ</h2>
          <ProductList />
        </div>
      </div>
    </ResponsiveLayout>
  )
}
