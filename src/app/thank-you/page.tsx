"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold mb-4">ขอบคุณสำหรับการสั่งซื้อ</h1>
            <p className="text-lg text-muted-foreground mb-8">
              คำสั่งซื้อของคุณได้รับการยืนยันเรียบร้อยแล้ว เราจะจัดส่งสินค้าให้คุณโดยเร็วที่สุด
            </p>

            <div className="bg-muted/30 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold mb-4">รายละเอียดการสั่งซื้อ</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">หมายเลขคำสั่งซื้อ</p>
                  <p className="font-medium">ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">วันที่สั่งซื้อ</p>
                  <p className="font-medium">{new Date().toLocaleDateString("th-TH")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">วิธีการชำระเงิน</p>
                  <p className="font-medium">บัตรเครดิต / เดบิต</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">สถานะการชำระเงิน</p>
                  <p className="font-medium text-green-600">ชำระเงินแล้ว</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">เลือกซื้อสินค้าเพิ่มเติม</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/account/orders">ดูประวัติการสั่งซื้อ</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
