"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CreditCard, MapPin, Truck } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  // สถานะสำหรับฟอร์ม
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    postalCode: "",
    paymentMethod: "credit_card",
    notes: "",
  })

  // คำนวณค่าจัดส่ง
  const shippingFee = items.length > 0 ? 50 : 0

  // คำนวณยอดรวมทั้งหมด
  const totalAmount = getSubtotal() + shippingFee

  // ตรวจสอบว่ามีสินค้าที่ต้องใช้ใบสั่งแพทย์หรือไม่
  const hasPrescriptionItems = items.some((item) => item.prescription)

  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // จัดการการเปลี่ยนแปลงวิธีการชำระเงิน
  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  // จัดการการส่งฟอร์ม
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
    if (items.length === 0) {
      toast({
        title: "ตะกร้าว่างเปล่า",
        description: "กรุณาเพิ่มสินค้าลงในตะกร้าก่อนดำเนินการชำระเงิน",
        variant: "destructive",
      })
      return
    }

    // จำลองการส่งข้อมูลไปยังเซิร์ฟเวอร์
    console.log("Order data:", { items, formData, totalAmount })

    // แสดงข้อความแจ้งเตือนการสั่งซื้อสำเร็จ
    toast({
      title: "สั่งซื้อสำเร็จ",
      description: "ขอบคุณสำหรับการสั่งซื้อ เราได้รับคำสั่งซื้อของคุณแล้ว",
    })

    // ล้างตะกร้า
    clearCart()

    // นำผู้ใช้ไปยังหน้าขอบคุณ
    router.push("/thank-you")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">ชำระเงิน</h1>

          {items.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground mb-4">ตะกร้าสินค้าของคุณว่างเปล่า</p>
              <Button asChild>
                <Link href="/products">เลือกซื้อสินค้า</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ฟอร์มข้อมูลการจัดส่งและชำระเงิน */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit}>
                  {/* ข้อมูลการจัดส่ง */}
                  <div className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="mr-2" size={20} />
                      ที่อยู่จัดส่ง
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="fullName">ชื่อ-น��มสกุล</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">อีเมล</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address">ที่อยู่</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="province">จังหวัด</Label>
                        <Input
                          id="province"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="postalCode">รหัสไปรษณีย์</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* วิธีการจัดส่ง */}
                  <div className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <Truck className="mr-2" size={20} />
                      วิธีการจัดส่ง
                    </h2>

                    <RadioGroup defaultValue="standard">
                      <div className="flex items-center space-x-2 border rounded-md p-3 mb-2">
                        <RadioGroupItem value="standard" id="standard" checked />
                        <Label htmlFor="standard" className="flex-grow">
                          จัดส่งมาตรฐาน (2-3 วันทำการ)
                        </Label>
                        <span className="font-medium">฿50.00</span>
                      </div>

                      <div className="flex items-center space-x-2 border rounded-md p-3 opacity-50">
                        <RadioGroupItem value="express" id="express" disabled />
                        <Label htmlFor="express" className="flex-grow">
                          จัดส่งด่วน (1 วันทำการ)
                        </Label>
                        <span className="font-medium">฿100.00</span>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* วิธีการชำระเงิน */}
                  <div className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <CreditCard className="mr-2" size={20} />
                      วิธีการชำระเงิน
                    </h2>

                    <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                      <div className="flex items-center space-x-2 border rounded-md p-3 mb-2">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card">บัตรเครดิต / เดบิต</Label>
                      </div>

                      <div className="flex items-center space-x-2 border rounded-md p-3 mb-2">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer">โอนเงินผ่านธนาคาร</Label>
                      </div>

                      <div className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod">เก็บเงินปลายทาง (COD)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* หมายเหตุ */}
                  <div className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">หมายเหตุ</h2>

                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="หมายเหตุเพิ่มเติมสำหรับการจัดส่ง (ถ้ามี)"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>

                  {/* ปุ่มดำเนินการต่อ */}
                  <div className="flex justify-end">
                    <Button type="submit" size="lg">
                      ยืนยันการสั่งซื้อ
                    </Button>
                  </div>
                </form>
              </div>

              {/* สรุปคำสั่งซื้อ */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border p-6 sticky top-4">
                  <h2 className="text-lg font-semibold mb-4">สรุปคำสั่งซื้อ</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">สินค้า ({items.length} รายการ)</span>
                      <span>{getSubtotal().toFixed(2)} บาท</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ค่าจัดส่ง</span>
                      <span>{shippingFee.toFixed(2)} บาท</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-semibold text-lg mb-6">
                    <span>ยอดรวมทั้งสิ้น</span>
                    <span className="text-primary">{totalAmount.toFixed(2)} บาท</span>
                  </div>

                  {hasPrescriptionItems && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm mb-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                        <p>คำสั่งซื้อของคุณมีสินค้าที่ต้องใช้ใบสั่งแพทย์ กรุณาเตรียมใบสั่งแพทย์ให้พร้อมในขั้นตอนการชำระเงิน</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="font-medium">รายการสินค้า:</h3>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                        <div>
                          <span>{item.name}</span>
                          <span className="text-muted-foreground"> x{item.quantity}</span>
                          {item.prescription && <div className="text-xs text-red-500 mt-1">ต้องมีใบสั่งแพทย์</div>}
                        </div>
                        <span>{(item.price * item.quantity).toFixed(2)} บาท</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
