import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrderForm } from "@/components/forms/order-form"

export default function NewOrderPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">ลงทะเบียนเพื่อสั่งซื้อยา</h1>
            <p className="text-muted-foreground mb-8">กรุณากรอกข้อมูลบุคลากรทางการแพทย์เพื่อรับสิทธิพิเศษและสั่งซื้อยา</p>

            <OrderForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
