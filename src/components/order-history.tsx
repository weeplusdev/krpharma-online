"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText, RefreshCw } from "lucide-react"
import Link from "next/link"

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

type Order = {
  id: string
  date: string
  total: number
  items: number
  status: OrderStatus
}

type OrderHistoryProps = {
  limit?: number
}

// แปลสถานะเป็นภาษาไทย
const statusMap: Record<OrderStatus, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> =
  {
    pending: { label: "รอดำเนินการ", variant: "outline" },
    processing: { label: "กำลังจัดเตรียม", variant: "secondary" },
    shipped: { label: "จัดส่งแล้ว", variant: "default" },
    delivered: { label: "ได้รับแล้ว", variant: "default" },
    cancelled: { label: "ยกเลิก", variant: "destructive" },
  }

// ข้อมูลตัวอย่างประวัติการสั่งซื้อ
const mockOrders: Order[] = [
  { id: "MED23120001", date: "2023-12-10", total: 12500, items: 5, status: "delivered" },
  { id: "MED23110015", date: "2023-11-22", total: 8750, items: 3, status: "delivered" },
  { id: "MED23110008", date: "2023-11-15", total: 15000, items: 8, status: "delivered" },
  { id: "MED23100022", date: "2023-10-30", total: 6200, items: 4, status: "delivered" },
  { id: "MED23100013", date: "2023-10-18", total: 9100, items: 6, status: "delivered" },
]

export function OrderHistory({ limit }: OrderHistoryProps) {
  const [isLoading, setIsLoading] = useState(false)
  const orders = limit ? mockOrders.slice(0, limit) : mockOrders

  const refreshOrders = () => {
    setIsLoading(true)
    // จำลองการโหลดข้อมูล
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">ประวัติการสั่งซื้อ</h2>
        <Button variant="outline" size="sm" onClick={refreshOrders} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          รีเฟรช
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>หมายเลขคำสั่งซื้อ</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>รายการ</TableHead>
              <TableHead className="text-right">ยอดรวม</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">ดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString("th-TH")}</TableCell>
                  <TableCell>{order.items} รายการ</TableCell>
                  <TableCell className="text-right">{order.total.toLocaleString()} บาท</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[order.status].variant}>{statusMap[order.status].label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">ดูรายละเอียด</span>
                        </Link>
                      </Button>
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/orders/${order.id}/receipt`}>
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">ใบเสร็จ</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  {isLoading ? "กำลังโหลดข้อมูล..." : "������มีประวัติการสั่งซื้อ"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {limit && orders.length > 0 && (
        <div className="text-center">
          <Link href="/orders" className="text-sm text-primary hover:underline">
            ดูประวัติการสั่งซื้อทั้งหมด
          </Link>
        </div>
      )}
    </div>
  )
}
