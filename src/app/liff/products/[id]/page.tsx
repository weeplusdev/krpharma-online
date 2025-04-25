"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Heart, Share2, ShoppingCart, Star, Plus, Minus, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useMobile } from "@/hooks/use-mobile"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const isMobile = useMobile()
  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [showPrescriptionAlert, setShowPrescriptionAlert] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  // สมมติว่าเราดึงข้อมูลสินค้าจาก API ตาม ID
  const productId = params.id as string
  const product = products.find((p) => p.id === productId) || products[0]

  // จำลองการโหลดข้อมูล
  useEffect(() => {
    // สมมติว่าเราเรียก API ที่นี่
    // ในตัวอย่างนี้เราใช้ข้อมูลจำลอง
  }, [productId])

  const handleAddToCart = () => {
    if (product.requiresPrescription) {
      setShowPrescriptionAlert(true)
    } else {
      // เพิ่มสินค้าลงตะกร้า
      setIsAddedToCart(true)
      setTimeout(() => setIsAddedToCart(false), 2000)
    }
  }

  const handleBuyNow = () => {
    if (product.requiresPrescription) {
      setShowPrescriptionAlert(true)
    } else {
      // ไปที่หน้าชำระเงิน
      router.push("/liff/checkout")
    }
  }

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist)
  }

  const handleShare = () => {
    // ฟังก์ชันแ�������ร์ผ่าน LINE
    if (typeof window !== "undefined" && (window as any).liff) {
      try {
        ;(window as any).liff.shareTargetPicker([
          {
            type: "text",
            text: `ดูสินค้า ${product.name} ที่ MedPharma: https://medpharma.com/products/${product.id}`,
          },
        ])
      } catch (error) {
        console.error("Error sharing product:", error)
      }
    } else {
      // Fallback สำหรับกรณีที่ไม่ได้เปิดใน LIFF
      if (navigator.share) {
        navigator.share({
          title: product.name,
          text: `ดูสินค้า ${product.name} ที่ MedPharma`,
          url: `https://medpharma.com/products/${product.id}`,
        })
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-medium truncate max-w-[200px]">รายละเอียดสินค้า</h1>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleToggleWishlist}>
              <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20">
        {/* Product Images */}
        <div className="relative bg-muted/30">
          <div className="aspect-square relative">
            <Image
              src={product.images[currentImage] || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>

          {product.discount && <Badge className="absolute top-4 left-4 bg-red-500">-{product.discount}%</Badge>}

          {product.isNew && <Badge className="absolute top-4 right-4 bg-blue-500">ใหม่</Badge>}

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex justify-center gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentImage === index ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="container px-4 py-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold">{product.name}</h1>
              {product.inStock ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  มีสินค้า
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  สินค้าหมด
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewCount} รีวิว)</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">฿{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">฿{product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {product.requiresPrescription && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md border border-amber-200">
                <AlertTriangle size={16} className="text-amber-500" />
                <span className="text-sm text-amber-700">สินค้านี้ต้องมีใบสั่งยาจากแพทย์</span>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">จำนวน</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-none rounded-l-md"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </Button>
              <div className="w-12 h-9 flex items-center justify-center border-l border-r">{quantity}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-none rounded-r-md"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="description">รายละเอียด</TabsTrigger>
              <TabsTrigger value="info">ข้อมูลเพิ่มเติม</TabsTrigger>
              <TabsTrigger value="reviews">รีวิว</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p className="text-sm text-muted-foreground">{product.description}</p>

              <div className="mt-4 space-y-3">
                <h3 className="font-medium">คุณสมบัติ</h3>
                <ul className="text-sm space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="info" className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">แบรนด์</div>
                  <div>{product.brand}</div>

                  <div className="text-muted-foreground">หมวดหมู่</div>
                  <div>{product.category}</div>

                  <div className="text-muted-foreground">รูปแบบ</div>
                  <div>{product.form}</div>

                  <div className="text-muted-foreground">ขนาด</div>
                  <div>{product.size}</div>

                  <div className="text-muted-foreground">น้ำหนัก</div>
                  <div>{product.weight}</div>

                  <div className="text-muted-foreground">วันหมดอายุ</div>
                  <div>{product.expiryDate}</div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="storage">
                    <AccordionTrigger className="text-sm">วิธีเก็บรักษา</AccordionTrigger>
                    <AccordionContent className="text-sm">{product.storage}</AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="usage">
                    <AccordionTrigger className="text-sm">วิธีใช้</AccordionTrigger>
                    <AccordionContent className="text-sm">{product.usage}</AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="warnings">
                    <AccordionTrigger className="text-sm">คำเตือน</AccordionTrigger>
                    <AccordionContent className="text-sm">{product.warnings}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold">{product.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">จาก 5</span>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{product.reviewCount} รีวิว</div>
                </div>

                <Separator />

                {product.reviews.map((review, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="font-medium">{review.name}</div>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-sm">{review.comment}</p>
                    {index < product.reviews.length - 1 && <Separator />}
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  ดูรีวิวทั้งหมด
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          <div className="mb-6">
            <h2 className="font-bold mb-3">สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/liff/products/${product.id}`}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="aspect-square relative bg-muted/30 p-2">
                    <Image
                      src={product.image || "/placeholder.svg?height=100&width=100"}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="object-contain mx-auto"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-bold text-primary">฿{product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ฿{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          เพิ่มลงตะกร้า
        </Button>
        <Button className="flex-1" onClick={handleBuyNow} disabled={!product.inStock}>
          ซื้อทันที
        </Button>
      </div>

      {/* Prescription Alert Dialog */}
      <Dialog open={showPrescriptionAlert} onOpenChange={setShowPrescriptionAlert}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-amber-600">
              <AlertTriangle className="mr-2" size={20} />
              ต้องมีใบสั่งยาจากแพทย์
            </DialogTitle>
            <DialogDescription>{product.name} จำเป็นต้องมีใบสั่งแพทย์ คุณสามารถดำเนินการได้โดย:</DialogDescription>
          </DialogHeader>

          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>อัพโหลดใบสั่งยาในขั้นตอนการชำระเงิน</li>
            <li>ส่งใบสั่งยาผ่านแชทกับเภสัชกร</li>
            <li>เข้ารับคำปรึกษาออนไลน์กับแพทย์ของเรา</li>
          </ul>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" className="flex-1" onClick={() => setShowPrescriptionAlert(false)}>
              ยกเลิก
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setShowPrescriptionAlert(false)
                setIsAddedToCart(true)
                setTimeout(() => setIsAddedToCart(false), 2000)
              }}
            >
              ดำเนินการต่อ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Added to Cart Toast */}
      {isAddedToCart && (
        <div className="fixed bottom-20 left-0 right-0 mx-auto w-max bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <Check size={16} />
          <span>เพิ่มลงตะกร้าแล้ว</span>
        </div>
      )}
    </div>
  )
}

// ข้อมูลจำลอง
const products = [
  {
    id: "1",
    name: "เครื่องวัดความดันโลหิตดิจิตอล Omron HEM-7120",
    description:
      "เครื่องวัดความดันโลหิตอัตโนมัติแบบพกพา ใช้งานง่าย แม่นยำสูง ใช้ได้ทั้งที่บ้านและพกพาเดินทาง เหมาะสำหรับผู้ที่ต้องการดูแลสุขภาพและผู้ป่วยความดันโลหิตสูง",
    price: 1990,
    originalPrice: 2490,
    discount: 20,
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    brand: "Omron",
    category: "เครื่องมือทางการแพทย์",
    form: "เครื่องวัดความดัน",
    size: "กะทัดรัด",
    weight: "250 กรัม",
    expiryDate: "ไม่มีวันหมดอายุ",
    storage: "เก็บในที่แห้ง ห่างจากความชื้น ไม่โดนแสงแดดโดยตรง",
    usage: "วัดความดันโลหิตโดยพันผ้ารัดที่ต้นแขน กดปุ่มเริ่มการทำงาน รอจนกว่าเครื่องจะแสดงผล",
    warnings: "ควรปรึกษาแพทย์หากพบความผิดปกติของความดันโลหิต",
    inStock: true,
    stock: 10,
    rating: 4.5,
    reviewCount: 120,
    requiresPrescription: false,
    isNew: false,
    features: [
      "วัดความดันโลหิตได้แม่นยำ",
      "หน่วยความจำบันทึกค่าได้ 30 ครั้ง",
      "แสดงผลดิจิตอลชัดเจน",
      "ใช้งานง่ายด้วยปุ่มเดียว",
      "แบตเตอรี่ใช้งานได้นาน",
    ],
    reviews: [
      {
        name: "คุณสมชาย",
        date: "15/03/2023",
        rating: 5,
        comment: "ใช้งานง่าย วัดได้แม่นยำ คุ้มค่ากับราคา",
      },
      {
        name: "คุณนภา",
        date: "02/02/2023",
        rating: 4,
        comment: "สินค้าดี ส่งเร็ว แต่กล่องมีรอยบุบเล็กน้อย",
      },
      {
        name: "คุณวิชัย",
        date: "10/01/2023",
        rating: 5,
        comment: "ซื้อให้คุณพ่อใช้ เขาชอบมาก ใช้งานง่าย",
      },
    ],
  },
  {
    id: "2",
    name: "เทอร์โมมิเตอร์วัดไข้ทางหน้าผากแบบอินฟราเรด",
    description: "เครื่องวัดอุณหภูมิแบบไม่สัมผัส วัดได้รวดเร็วภายใน 1 วินาที แม่นยำสูง เหมาะสำหรับเด็กและผู้ใหญ่",
    price: 1290,
    originalPrice: 1590,
    discount: 20,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    brand: "Beurer",
    category: "เครื่องมือทางการแพทย์",
    form: "เครื่องวัดอุณหภูมิ",
    size: "พกพา",
    weight: "100 กรัม",
    expiryDate: "ไม่มีวันหมดอายุ",
    storage: "เก็บในที่แห้ง ห่างจากความชื้น ไม่โดนแสงแดดโดยตรง",
    usage: "เปิดเครื่อง จ่อที่หน้าผากห่างประมาณ 3-5 ซม. กดปุ่มวัด รอสัญญาณเสียงและอ่านค่า",
    warnings: "ควรปรึกษาแพทย์หากมีไข้สูงเกิน 38.5 องศาเซลเซียส",
    inStock: true,
    stock: 15,
    rating: 4.8,
    reviewCount: 95,
    requiresPrescription: false,
    isNew: true,
    features: [
      "วัดอุณหภูมิแบบไม่สัมผัส",
      "ผลลัพธ์รวดเร็วภายใน 1 วินาที",
      "หน้าจอ LCD แสดงผลชัดเจน",
      "มีไฟส่องสว่างในที่มืด",
      "แบตเตอรี่ใช้งานได้นาน",
    ],
    reviews: [
      {
        name: "คุณแม่น้องเมย์",
        date: "20/04/2023",
        rating: 5,
        comment: "สะดวกมากสำหรับวัดไข้เด็ก ไม่ต้องปลุกลูกตอนหลับ",
      },
      {
        name: "คุณพลอย",
        date: "15/03/2023",
        rating: 5,
        comment: "ใช้งานง่าย วัดได้แม่นยำ คุ้มค่ากับราคา",
      },
    ],
  },
  {
    id: "3",
    name: "ยาพาราเซตามอล 500 มก. (100 เม็ด)",
    description: "ยาบรรเทาอาการปวด ลดไข้ ใช้สำหรับบรรเทาอาการปวดศีรษะ ปวดฟัน ปวดกล้ามเนื้อ และลดไข้",
    price: 120,
    originalPrice: null,
    discount: null,
    images: ["/placeholder.svg?height=400&width=400"],
    brand: "Tylenol",
    category: "ยา",
    form: "เม็ด",
    size: "500 มก. 100 เม็ด",
    weight: "50 กรัม",
    expiryDate: "12/2025",
    storage: "เก็บในที่แห้ง อุณหภูมิห้อง ห่างจากแสงแดดและความร้อน",
    usage: "รับประทานครั้งละ 1-2 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการ ไม่ควรรับประทานเกิน 8 เม็ดต่อวัน",
    warnings: "ห้ามใช้ในผู้ที่แพ้ยาพาราเซตามอล ควรระวังในผู้ป่วยโรคตับ ไม่ควรใช้ติดต่อกันเกิน 5 วัน",
    inStock: true,
    stock: 50,
    rating: 4.2,
    reviewCount: 210,
    requiresPrescription: false,
    isNew: false,
    features: ["บรรเทาอาการปวดศีรษะ", "ลดไข้", "บรรเทาอาการปวดกล้ามเนื้อ", "บรรเทาอาการปวดฟัน", "ออกฤทธิ์ภายใน 30 นาที"],
    reviews: [
      {
        name: "คุณมานี",
        date: "10/05/2023",
        rating: 5,
        comment: "ใช้แล้วหายปวดหัวเร็ว ราคาไม่แพง",
      },
      {
        name: "คุณสมศักดิ์",
        date: "05/04/2023",
        rating: 4,
        comment: "ยาพื้นฐานที่ควรมีติดบ้าน ใช้ได้ดี",
      },
    ],
  },
]

const relatedProducts = [
  {
    id: "4",
    name: "เครื่องวัดออกซิเจนในเลือด Pulse Oximeter",
    price: 850,
    originalPrice: 990,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "5",
    name: "เครื่องพ่นละอองยา Nebulizer",
    price: 1450,
    originalPrice: null,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "6",
    name: "ชุดตรวจน้ำตาลในเลือด Glucometer",
    price: 1200,
    originalPrice: 1500,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "7",
    name: "เครื่องวัดอุณหภูมิทางหู Ear Thermometer",
    price: 990,
    originalPrice: 1290,
    image: "/placeholder.svg?height=100&width=100",
  },
]
