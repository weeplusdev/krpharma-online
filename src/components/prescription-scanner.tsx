"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, FlipHorizontal, RefreshCw, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type PrescriptionScannerProps = {
  onCapture: (imageData: string, extractedText: string) => void
  onCancel: () => void
}

export function PrescriptionScanner({ onCapture, onCancel }: PrescriptionScannerProps) {
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // เริ่มต้นกล้อง
  const startCamera = useCallback(async () => {
    try {
      if (videoRef.current) {
        const constraints = {
          video: {
            facingMode: isFrontCamera ? "user" : "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true)
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }, [isFrontCamera])

  // หยุดกล้อง
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraReady(false)
    }
  }, [])

  // สลับกล้องหน้า/หลัง
  const toggleCamera = useCallback(() => {
    stopCamera()
    setIsFrontCamera((prev) => !prev)
  }, [stopCamera])

  // ถ่ายรูป
  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // ตั้งค่าขนาด canvas ตามวิดีโอ
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // วาดภาพจากวิดีโอลงบน canvas
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // แปลง canvas เป็น data URL
        const imageData = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageData)
        stopCamera()

        // จำลองการประมวลผล OCR
        setIsProcessing(true)
        setTimeout(() => {
          // ในสถานการณ์จริง จะส่ง imageData ไปยัง API OCR
          const mockExtractedText = simulateOCR()
          setIsProcessing(false)
          onCapture(imageData, mockExtractedText)
        }, 2000)
      }
    }
  }, [stopCamera, onCapture])

  // จำลองการประมวลผล OCR
  const simulateOCR = () => {
    // ในสถานการณ์จริง จะใช้ API OCR เช่น Google Cloud Vision, Azure Computer Vision
    return `
      รายการยา:
      1. Amoxicillin 500mg #30 1 tab tid pc
      2. Paracetamol 500mg #20 1 tab prn q 4-6 hr
      3. Omeprazole 20mg #14 1 cap od ac
      4. Loratadine 10mg #10 1 tab od pc
      
      แพทย์ผู้สั่ง: นพ.สมชาย ใจดี
      วันที่: 15/05/2023
    `
  }

  // เริ่มต้นกล้องเมื่อคอมโพเนนต์ถูกโหลด
  useState(() => {
    startCamera()

    // Cleanup เมื่อคอมโพเนนต์ถูกทำลาย
    return () => {
      stopCamera()
    }
  })

  // ถ่ายรูปใหม่
  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden mb-4">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn("absolute inset-0 w-full h-full object-cover", !isCameraReady && "hidden")}
            />
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 border-2 border-white/30 rounded-lg pointer-events-none" />
          </>
        ) : (
          <img
            src={capturedImage || "/placeholder.svg"}
            alt="Captured prescription"
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}

        {/* Canvas สำหรับการประมวลผลภาพ (ซ่อนไว้) */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {isProcessing ? (
        <Card className="w-full p-4 mb-4">
          <div className="flex items-center space-x-4">
            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
            <div className="space-y-2">
              <p className="text-sm font-medium">กำลังประมวลผลใบสั่งยา...</p>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          </div>
        </Card>
      ) : capturedImage ? (
        <div className="w-full space-y-4">
          <p className="text-center text-sm text-muted-foreground">กรุณาตรวจสอบภาพถ่าย ภาพชัดเจนหรือไม่?</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={retakePhoto}>
              <X className="mr-2 h-4 w-4" />
              ถ่ายใหม่
            </Button>
            <Button className="flex-1" onClick={captureImage}>
              <Check className="mr-2 h-4 w-4" />
              ยืนยัน
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              ยกเลิก
            </Button>
            <Button variant="outline" className="flex-1" onClick={toggleCamera}>
              <FlipHorizontal className="mr-2 h-4 w-4" />
              สลับกล้อง
            </Button>
            <Button className="flex-1" onClick={captureImage}>
              <Camera className="mr-2 h-4 w-4" />
              ถ่ายภาพ
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">จัดให้ใบสั่งยาอยู่ในกรอบและถ่ายให้ชัดเจน</p>
        </div>
      )}
    </div>
  )
}
