"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCart()
  const [couponCode, setCouponCode] = useState("")

  // คำนวณค่าจัดส่ง
  const shippingFee = items.length > 0 ? 50 : 0

  // คำนวณส่วนลด (ตัวอย่าง)
  const discount = couponCode === "DISCOUNT20" ? getSubtotal() * 0.2 : 0

  // คำนวณยอดรวมทั้งหมด
  const totalAmount = getSubtotal() + shippingFee - discount

  // ตรวจสอบว่ามีสินค้าที่ต้องใช้ใบสั่งแพทย์หรือไม่
  const hasPrescriptionItems = items.some((item) => item.prescription)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">ตะกร้าสินค้า</h1>

          {items.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">ตะกร้าสินค้าของคุณว่างเปล่า</p>
              <Button asChild>
                <Link href="/products">เลือกซื้อสินค้า</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* รายการสินค้า */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">รายการสินค้า ({items.length})</h2>
                    <Button variant="outline" size="sm" onClick={clearCart}>
                      <Trash2 size={16} className="mr-2" />
                      ล้างตะกร้า
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center py-4 border-b last:border-0">
                        <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center mr-4">
                          {item.image ? (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="object-contain"
                            />
                          ) : (
                            <Image
                              src="/placeholder.svg?height=80&width=80"
                              alt={item.name}
                              width={80}
                              height={80}
                              className="object-contain"
                            />
                          )}
                        </div>

                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              {item.form && <p className="text-sm text-muted-foreground">รูปแบบ: {item.form}</p>}
                              {item.prescription && (
                                <Badge variant="destructive" className="mt-1 flex items-center gap-1 w-fit">
                                  <AlertTriangle size={12} />
                                  ต้องมีใบสั่งแพทย์
                                </Badge>
                              )}
                            </div>
                            <p className="font-semibold text-primary">{item.price} บาท</p>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none rounded-l-md"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} />
                              </Button>
                              <span className="w-10 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none rounded-r-md"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={14} />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 size={16} className="mr-1" />
                              ลบ
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* สรุปคำสั่งซื้อ */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border p-6 sticky top-4">
                  <h2 className="text-lg font-semibold mb-4">สรุปคำสั่งซื้อ</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ยอดรวม</span>
                      <span>{getSubtotal().toFixed(2)} บาท</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ค่าจัดส่ง</span>
                      <span>{shippingFee.toFixed(2)} บาท</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>ส่วนลด</span>
                        <span>-{discount.toFixed(2)} บาท</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-semibold text-lg mb-6">
                    <span>ยอดรวมทั้งสิ้น</span>
                    <span className="text-primary">{totalAmount.toFixed(2)} บาท</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="รหัสส่วนลด"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button variant="outline">ใช้</Button>
                    </div>

                    {hasPrescriptionItems && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                          <p>คำสั่งซื้อของคุณมีสินค้าที่ต้องใช้ใบสั่งแพทย์ กรุณาเตรียมใบสั่งแพทย์ให้พร้อมในขั้นตอนการชำระเงิน</p>
                        </div>
                      </div>
                    )}

                    <Button className="w-full" size="lg" asChild>
                      <Link href="/checkout">ดำเนินการชำระเงิน</Link>
                    </Button>

                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/products">เลือกซื้อสินค้าเพิ่มเติม</Link>
                    </Button>
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
