import { ResponsiveLayout } from "@/components/responsive-layout"
import { ProductList } from "@/components/product-list"

export default function WebProductsPage() {
  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">สินค้าทั้งหมด</h1>
        <ProductList />
      </div>
    </ResponsiveLayout>
  )
}
