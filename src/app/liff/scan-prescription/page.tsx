"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, FileText, Camera, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PrescriptionScanner } from "@/components/prescription-scanner"
import { ScrollArea } from "@/components/ui/scroll-area"

type ScanStage = "intro" | "scanning" | "review" | "processing" | "complete"

export default function ScanPrescriptionPage() {
  const router = useRouter()
  const [stage, setStage] = useState<ScanStage>("intro")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>("")
  const [processedItems, setProcessedItems] = useState<
    Array<{
      id: string
      name: string
      quantity: number
      found: boolean
    }>
  >([])

  // จัดการเมื่อถ่ายรูปเสร็จและได้ข้อความจาก OCR
  const handleCapture = (imageData: string, extractedText: string) => {
    setCapturedImage(imageData)
    setExtractedText(extractedText)
    setStage("review")

    // จำลองการประมวลผลข้อมูลยา
    setTimeout(() => {
      // ในสถานการณ์จริง จะวิเคราะห์ข้อความและค้นหายาในฐานข้อมูล
      const mockProcessedItems = [
        { id: "J01CA04-001", name: "Amoxicillin 500mg", quantity: 30, found: true },
        { id: "N02BE01-001", name: "Paracetamol 500mg", quantity: 20, found: true },
        { id: "A02BC01-001", name: "Omeprazole 20mg", quantity: 14, found: true },
        { id: "R06AX13-001", name: "Loratadine 10mg", quantity: 10, found: true },
        { id: "unknown", name: "Vitamin C 1000mg", quantity: 30, found: false },
      ]

      setProcessedItems(mockProcessedItems)
      setStage("processing")

      // จำลองการประมวลผลเสร็จสิ้น
      setTimeout(() => {
        setStage("complete")
      }, 2000)
    }, 1500)
  }

  // ยกเลิกการสแกน
  const handleCancel = () => {
    router.back()
  }

  // ไปยังหน้ารายการสั่งซื้อพร้อมข้อมูลที่ประมวลผลแล้ว
  const goToOrderPage = () => {
    // ในสถานการณ์จริง จะส่งข้อมูลไปยังหน้ารายการสั่งซื้อ
    // โดยอาจใช้ localStorage, URL parameters, หรือ state management

    // สร้าง query string จากรายการยาที่พบ
    const foundItems = processedItems.filter((item) => item.found)
    const queryParams = new URLSearchParams()

    foundItems.forEach((item) => {
      queryParams.append("items", `${item.id}:${item.quantity}`)
    })

    router.push(`/liff/products_by_order?${queryParams.toString()}&from=prescription`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-medium">
            {stage === "intro" && "สแกนใบสั่งยา"}
            {stage === "scanning" && "ถ่ายภาพใบสั่งยา"}
            {stage === "review" && "ตรวจสอบใบสั่งยา"}
            {stage === "processing" && "กำลังประมวลผล"}
            {stage === "complete" && "ประมวลผลเสร็จสิ้น"}
          </h1>
          <div className="w-5"></div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6">
        {stage === "intro" && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">สแกนใบสั่งยาของคุณ</h2>
              <p className="text-center text-muted-foreground max-w-xs">
                ถ่ายรูปใบสั่งยาที่เขียนด้วยลายมือหรือพิมพ์ เพื่อแปลงเป็นรายการสั่งซื้อโดยอัตโนมัติ
              </p>
            </div>

            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">คำแนะนำในการถ่ายภาพ:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>วางใบสั่งยาบนพื้นผิวที่มีแสงสว่างเพียงพอ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>จัดให้ใบสั่งยาอยู่ในกรอบทั้งหมด</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>ถ่ายให้ชัดเจน ไม่เบลอ และไม่มีเงาบัง</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Button className="w-full" onClick={() => setStage("scanning")}>
              <Camera className="mr-2 h-4 w-4" />
              เริ่มถ่ายภาพ
            </Button>
          </div>
        )}

        {stage === "scanning" && <PrescriptionScanner onCapture={handleCapture} onCancel={() => setStage("intro")} />}

        {stage === "review" && capturedImage && (
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden mb-4">
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured prescription"
                className="w-full h-full object-contain"
              />
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">ข้อความที่สกัดได้:</h3>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <pre className="text-sm whitespace-pre-wrap">{extractedText}</pre>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStage("scanning")}>
                ถ่ายใหม่
              </Button>
              <Button className="flex-1" onClick={() => setStage("processing")}>
                ยืนยันและประมวลผล
              </Button>
            </div>
          </div>
        )}

        {stage === "processing" && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative mb-4">
                <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">กำลังประมวลผลใบสั่งยา</h2>
              <p className="text-center text-muted-foreground max-w-xs">
                กรุณารอสักครู่ ระบบกำลังวิเคราะห์ใบสั่งยาและค้นหารายการยาในระบบ
              </p>
            </div>
          </div>
        )}

        {stage === "complete" && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">ประมวลผลเสร็จสิ้น</h2>
              <p className="text-center text-muted-foreground max-w-xs">
                พบรายการยาในระบบ {processedItems.filter((item) => item.found).length} รายการ จากทั้งหมด{" "}
                {processedItems.length} รายการ
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">รายการยาที่พบ:</h3>
                <div className="space-y-3">
                  {processedItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.found ? "bg-green-500" : "bg-red-500"}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">จำนวน: {item.quantity}</p>
                      </div>
                      {!item.found && <span className="text-xs text-red-500">ไม่พบในระบบ</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" onClick={goToOrderPage}>
              ไปยังรายการสั่งซื้อ
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
