"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  Search,
  Filter,
  X,
  ShoppingCart,
  Info,
  AlertTriangle,
  Plus,
  Minus,
  Camera,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { atcCategories, professionalMedications } from "@/lib/atc-data"
import { Card, CardContent } from "@/components/ui/card"

// ตัวอย่างการใช้ useLiffNavigation
import { useLiffNavigation } from "@/components/liff-navigation"

// แยก Component ที่ใช้ useSearchParams
function ProductsByOrderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [selectedMed, setSelectedMed] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category") || null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(searchParams.get("subgroup") || null)
  const [sortOption, setSortOption] = useState("popular")
  const [prescriptionOnly, setPrescriptionOnly] = useState(false)
  const [professionalOnly, setProfessionalOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showPrescriptionBanner, setShowPrescriptionBanner] = useState(false)

  const { navigateTo } = useLiffNavigation()

  // จำลองการโหลดข้อมูล
  useEffect(() => {
    // ในสถานการณ์จริง เราจะเรียก API เพื่อดึงข้อมูล
    if (searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category"))
    }

    if (searchParams.get("subgroup")) {
      setSelectedSubCategory(searchParams.get("subgroup"))
    }

    // ตรวจสอบว่ามาจากหน้าสแกนใบสั่งยาหรือไม่
    const fromPrescription = searchParams.get("from") === "prescription"
    if (fromPrescription) {
      setShowPrescriptionBanner(true)

      // ดึงรายการยาจาก URL parameters
      const items = searchParams.getAll("items")
      if (items.length > 0) {
        const newCartItems: { [key: string]: number } = {}

        items.forEach((item) => {
          const [id, quantity] = item.split(":")
          if (id && quantity) {
            newCartItems[id] = Number.parseInt(quantity)
          }
        })

        setCartItems(newCartItems)
      }
    }
  }, [searchParams])

  // กรองยาตามเงื่อนไข
  const filteredMedications = useMemo(() => {
    let result = [...professionalMedications]

    // กรองตามหมวดหมู่
    if (selectedCategory) {
      result = result.filter((med) => med.atcCode === selectedCategory)

      if (selectedSubCategory) {
        result = result.filter((med) => med.subCode === selectedSubCategory)
      }
    }

    // กรองตามคำค้นหา
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (med) => med.name.toLowerCase().includes(query) || med.description.toLowerCase().includes(query),
      )
    }

    // กรองตามราคา
    result = result.filter((med) => med.price >= priceRange[0] && med.price <= priceRange[1])

    // กรองยาที่ต้องมีใบสั่งยา
    if (prescriptionOnly) {
      result = result.filter((med) => med.requiresPrescription)
    }

    // กรองยาเฉพาะบุคลากร
    if (professionalOnly) {
      result = result.filter((med) => med.professionalOnly)
    }

    // กรองยาที่มีในสต็อก
    if (inStockOnly) {
      result = result.filter((med) => med.stock > 0)
    }

    // เรียงลำดับ
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "popular":
      default:
        result.sort((a, b) => Number(b.popularForProfessionals) - Number(a.popularForProfessionals))
        break
    }

    return result
  }, [
    selectedCategory,
    selectedSubCategory,
    searchQuery,
    priceRange,
    prescriptionOnly,
    professionalOnly,
    inStockOnly,
    sortOption,
  ])

  // จัดการเพิ่ม/ลดจำนวนในตะกร้า
  const handleAddToCart = (medId: string) => {
    setCartItems((prev) => {
      const newItems = { ...prev }
      if (newItems[medId]) {
        newItems[medId]++
      } else {
        newItems[medId] = 1
      }
      return newItems
    })
  }

  const handleRemoveFromCart = (medId: string) => {
    setCartItems((prev) => {
      const newItems = { ...prev }
      if (newItems[medId] > 1) {
        newItems[medId]--
      } else {
        delete newItems[medId]
      }
      return newItems
    })
  }

  const handleShowMedInfo = (medId: string) => {
    setSelectedMed(medId)
    setIsInfoModalOpen(true)
  }

  const selectedMedInfo = useMemo(() => {
    if (!selectedMed) return null
    return professionalMedications.find((med) => med.id === selectedMed)
  }, [selectedMed])

  const totalCartItems = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)
  const totalCartValue = Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const med = professionalMedications.find((m) => m.id === id)
    return sum + (med?.price || 0) * qty
  }, 0)

  // ล้างตัวกรอง
  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setPrescriptionOnly(false)
    setProfessionalOnly(false)
    setInStockOnly(false)
    setPriceRange([0, 2000])
    setSearchQuery("")
  }

  // ไปยังหน้าสแกนใบสั่งยา
  const goToScanPrescription = () => {
    navigateTo({ path: "scan-prescription" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-medium">ยาสำหรับบุคลากรทางการแพทย์</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalCartItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalCartItems}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* แบนเนอร์แสดงเมื่อมาจากหน้าสแกนใบสั่งยา */}
        {showPrescriptionBanner && (
          <div className="bg-green-50 border-b border-green-100 py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-1.5 rounded-full">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">นำเข้ารายการยาจากใบสั่งยาสำเร็จ</p>
                <p className="text-xs text-green-700">พบรายการยาในระบบ {Object.keys(cartItems).length} รายการ</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-700"
                onClick={() => setShowPrescriptionBanner(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="container px-4 py-3 sticky top-14 z-10 bg-background border-b">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                type="text"
                placeholder="ค้นหายา..."
                className="pl-9 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={14} />
                </Button>
              )}
            </div>

            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={goToScanPrescription}>
              <Camera size={16} />
            </Button>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                  <Filter size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>ตัวกรองและการเรียงลำดับ</SheetTitle>
                </SheetHeader>

                <Tabs defaultValue="category" className="mt-4">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="category">หมวดหมู่</TabsTrigger>
                    <TabsTrigger value="type">ประเภท</TabsTrigger>
                    <TabsTrigger value="sort">เรียงลำดับ</TabsTrigger>
                  </TabsList>

                  <TabsContent value="category" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-14rem)] pr-4">
                      <div className="space-y-4">
                        {atcCategories.map((category) => (
                          <div key={category.code}>
                            <button
                              onClick={() => {
                                setSelectedCategory(selectedCategory === category.code ? null : category.code)
                                setSelectedSubCategory(null)
                              }}
                              className={`flex items-center gap-2 w-full text-left hover:text-primary mb-2 ${
                                selectedCategory === category.code ? "font-medium text-primary" : ""
                              }`}
                            >
                              <div
                                className={`w-6 h-6 flex items-center justify-center rounded-sm border ${
                                  selectedCategory === category.code
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-muted-foreground/30"
                                }`}
                              >
                                {category.code}
                              </div>
                              <span>{category.name.th}</span>
                            </button>

                            {selectedCategory === category.code && (
                              <div className="ml-8 pl-2 border-l space-y-2">
                                {category.subgroups.map((sub) => (
                                  <button
                                    key={sub.code}
                                    onClick={() =>
                                      setSelectedSubCategory(selectedSubCategory === sub.code ? null : sub.code)
                                    }
                                    className={`block text-sm hover:text-primary ${
                                      selectedSubCategory === sub.code ? "font-medium text-primary" : ""
                                    }`}
                                  >
                                    {sub.name.th}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="type" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="liff-prescription"
                          checked={prescriptionOnly}
                          onCheckedChange={(checked) => setPrescriptionOnly(!!checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="liff-prescription"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            ยาควบคุมพิเศษ
                          </label>
                          <p className="text-sm text-muted-foreground">แสดงเฉพาะยาที่ต้องมีใบสั่งยา</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="liff-professional"
                          checked={professionalOnly}
                          onCheckedChange={(checked) => setProfessionalOnly(!!checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="liff-professional"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            เฉพาะบุคลากรทางการแพทย์
                          </label>
                          <p className="text-sm text-muted-foreground">แสดงเฉพาะยาที่จำหน่ายให้บุคลากรทางการแพทย์</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="liff-instock"
                          checked={inStockOnly}
                          onCheckedChange={(checked) => setInStockOnly(!!checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="liff-instock"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            มีสินค้าพร้อมจำหน่าย
                          </label>
                          <p className="text-sm text-muted-foreground">แสดงเฉพาะยาที่มีในสต็อก</p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <p className="text-sm font-medium mb-3">ช่วงราคา</p>
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${priceRange[0] === 0 && priceRange[1] === 500 ? "bg-primary text-primary-foreground" : ""}`}
                            onClick={() => setPriceRange([0, 500])}
                          >
                            ไม่เกิน 500฿
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${priceRange[0] === 500 && priceRange[1] === 1000 ? "bg-primary text-primary-foreground" : ""}`}
                            onClick={() => setPriceRange([500, 1000])}
                          >
                            500฿ - 1,000฿
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${priceRange[0] === 1000 && priceRange[1] === 2000 ? "bg-primary text-primary-foreground" : ""}`}
                            onClick={() => setPriceRange([1000, 2000])}
                          >
                            1,000฿ - 2,000฿
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${priceRange[0] === 0 && priceRange[1] === 2000 ? "bg-primary text-primary-foreground" : ""}`}
                            onClick={() => setPriceRange([0, 2000])}
                          >
                            ทุกช่วงราคา
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sort" className="mt-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium mb-3">เรียงลำดับตาม</p>
                      <Button
                        variant="outline"
                        className={`w-full justify-start ${sortOption === "popular" ? "bg-primary text-primary-foreground" : ""}`}
                        onClick={() => setSortOption("popular")}
                      >
                        ความนิยม
                      </Button>
                      <Button
                        variant="outline"
                        className={`w-full justify-start ${sortOption === "price-low" ? "bg-primary text-primary-foreground" : ""}`}
                        onClick={() => setSortOption("price-low")}
                      >
                        ราคา: ต่ำไปสูง
                      </Button>
                      <Button
                        variant="outline"
                        className={`w-full justify-start ${sortOption === "price-high" ? "bg-primary text-primary-foreground" : ""}`}
                        onClick={() => setSortOption("price-high")}
                      >
                        ราคา: สูงไปต่ำ
                      </Button>
                      <Button
                        variant="outline"
                        className={`w-full justify-start ${sortOption === "name" ? "bg-primary text-primary-foreground" : ""}`}
                        onClick={() => setSortOption("name")}
                      >
                        ชื่อ: A-Z
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <SheetFooter className="flex-row justify-between gap-2 mt-8">
                  <Button variant="outline" className="flex-1" onClick={clearFilters}>
                    ล้างตัวกรอง
                  </Button>
                  <SheetClose asChild>
                    <Button className="flex-1">ใช้ตัวกรอง</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {(selectedCategory ||
            selectedSubCategory ||
            prescriptionOnly ||
            professionalOnly ||
            inStockOnly ||
            priceRange[0] > 0 ||
            priceRange[1] < 2000) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {atcCategories.find((c) => c.code === selectedCategory)?.name.th}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedSubCategory(null)
                    }}
                  >
                    <span className="sr-only">Remove</span>×
                  </Button>
                </Badge>
              )}

              {selectedSubCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {
                    atcCategories
                      .find((c) => c.code === selectedCategory)
                      ?.subgroups.find((s) => s.code === selectedSubCategory)?.name.th
                  }
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setSelectedSubCategory(null)}
                  >
                    <span className="sr-only">Remove</span>×
                  </Button>
                </Badge>
              )}

              {prescriptionOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ยาควบคุมพิเศษ
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setPrescriptionOnly(false)}
                  >
                    <span className="sr-only">Remove</span>×
                  </Button>
                </Badge>
              )}

              {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ราคา: {priceRange[0]}-{priceRange[1]}฿
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setPriceRange([0, 2000])}
                  >
                    <span className="sr-only">Remove</span>×
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Scan Prescription Card */}
        <div className="container px-4 pt-4">
          <Card className="bg-primary/5 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">มีใบสั่งยาแบบกระดาษ?</h3>
                  <p className="text-xs text-muted-foreground">ถ่ายรูปใบสั่งยาเพื่อแปลงเป็นรายก���รสั่งซื้อโดยอัตโนมัติ</p>
                </div>
                <Button size="sm" onClick={goToScanPrescription}>
                  <Camera className="mr-2 h-4 w-4" />
                  สแกน
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product List */}
        <div className="container px-4 py-4">
          {filteredMedications.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">พบ {filteredMedications.length} รายการ</p>

              <div className="grid grid-cols-2 gap-3">
                {filteredMedications.map((med) => (
                  <div key={med.id} className="border rounded-lg overflow-hidden">
                    <div className="relative">
                      <div className="aspect-square bg-muted/30 p-2">
                        {med.discount && (
                          <Badge className="absolute top-2 left-2 z-10 bg-red-500">-{med.discount}%</Badge>
                        )}
                        {med.professionalOnly && (
                          <Badge className="absolute bottom-2 left-2 z-10 bg-primary">เฉพาะบุคลากร</Badge>
                        )}
                        <Image
                          src={med.image || "/placeholder.svg"}
                          alt={med.name}
                          width={150}
                          height={150}
                          className="object-contain mx-auto h-full"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80"
                          onClick={() => handleShowMedInfo(med.id)}
                        >
                          <Info size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-medium line-clamp-2 mb-1">{med.name}</h3>

                      <div className="text-xs text-muted-foreground mb-1">
                        <span className="inline-block mr-2">{med.strength}</span>
                        <span>
                          {med.unitsPerPackage} {med.form}/กล่อง
                        </span>
                      </div>

                      {med.requiresPrescription && (
                        <div className="flex items-center gap-1 text-amber-600 text-xs mb-1">
                          <AlertTriangle size={12} />
                          <span>ต้องมีใบสั่งยา</span>
                        </div>
                      )}

                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="font-bold text-primary">{med.price.toFixed(2)}฿</span>
                        {med.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {med.originalPrice.toFixed(2)}฿
                          </span>
                        )}
                      </div>

                      {med.stock > 0 ? (
                        cartItems[med.id] ? (
                          <div className="flex items-center justify-between">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveFromCart(med.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium">{cartItems[med.id]}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleAddToCart(med.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-xs"
                            onClick={() => handleAddToCart(med.id)}
                          >
                            <ShoppingCart className="mr-1 h-3 w-3" />
                            เพิ่มลงรายการ
                          </Button>
                        )
                      ) : (
                        <Button variant="outline" size="sm" className="w-full h-8 text-xs" disabled>
                          สินค้าหมด
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">ไม่พบสินค้าที่ค้นหา</div>
              <Button variant="outline" onClick={clearFilters}>
                ล้างตัวกรอง
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Shopping Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>รายการสั่งซื้อ</SheetTitle>
          </SheetHeader>

          {Object.keys(cartItems).length > 0 ? (
            <>
              <ScrollArea className="h-[calc(80vh-14rem)] mt-6 pr-4">
                <div className="space-y-4">
                  {Object.entries(cartItems).map(([id, qty]) => {
                    const med = professionalMedications.find((m) => m.id === id)
                    if (!med) return null
                    return (
                      <div key={id} className="flex items-center gap-3">
                        <div className="w-16 h-16 relative bg-muted/30 rounded-md shrink-0">
                          <Image
                            src={med.image || "/placeholder.svg"}
                            alt={med.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2">{med.name}</h4>
                          <div className="text-xs text-muted-foreground mt-1">
                            {med.strength} • {med.form}
                          </div>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="font-bold text-primary">{med.price.toFixed(2)}฿</span>
                            <span className="text-xs text-muted-foreground">x {qty}</span>
                            <span className="text-xs font-medium ml-1">= {(med.price * qty).toFixed(2)}฿</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleAddToCart(id)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium">{qty}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRemoveFromCart(id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              <div className="border-t mt-6 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">จำนวนรายการ:</span>
                  <span>{totalCartItems} รายการ</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ยอดรวม:</span>
                  <span className="font-bold text-lg">{totalCartValue.toLocaleString()} บาท</span>
                </div>
                <Button className="w-full" asChild onClick={() => setIsCartOpen(false)}>
                  <Link href="/liff/checkout">ดำเนินการสั่งซื้อ</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="h-[calc(80vh-14rem)] flex flex-col items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">ไม่มีสินค้าในรายการสั่งซื้อ</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                เลือกสินค้า
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Modal แสดงข้อมูลยา */}
      <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ข้อมูลยา</DialogTitle>
            <DialogDescription>รายละเอียดเพิ่มเติมเกี่ยวกับยาและการใช้งาน</DialogDescription>
          </DialogHeader>

          {selectedMedInfo && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3 relative aspect-square bg-muted/30">
                  <Image
                    src={selectedMedInfo.image || "/placeholder.svg"}
                    alt={selectedMedInfo.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <h3 className="font-semibold">{selectedMedInfo.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">{selectedMedInfo.description}</p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-muted-foreground">รหัส ATC:</div>
                    <div>{selectedMedInfo.atcCode}</div>

                    <div className="text-muted-foreground">หมวดหมู่ย่อย:</div>
                    <div>{selectedMedInfo.subCode}</div>

                    <div className="text-muted-foreground">ความแรง:</div>
                    <div>{selectedMedInfo.strength}</div>

                    <div className="text-muted-foreground">รูปแบบ:</div>
                    <div>{selectedMedInfo.form}</div>

                    <div className="text-muted-foreground">ขนาดบรรจุ:</div>
                    <div>
                      {selectedMedInfo.unitsPerPackage} {selectedMedInfo.form}/กล่อง
                    </div>

                    <div className="text-muted-foreground">ต้องมีใบสั่งยา:</div>
                    <div>{selectedMedInfo.requiresPrescription ? "ใช่" : "ไม่ใช่"}</div>

                    <div className="text-muted-foreground">ผู้ผลิต:</div>
                    <div>{selectedMedInfo.manufacturer}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-primary text-xl">{selectedMedInfo.price.toFixed(2)} บาท</span>
                  {selectedMedInfo.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {selectedMedInfo.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">สั่งขั้นต่ำ {selectedMedInfo.minOrderQuantity} ชิ้น</span>
              </div>

              <DialogFooter className="flex-row gap-2 sm:gap-0">
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setIsInfoModalOpen(false)}>
                  ปิด
                </Button>
                {selectedMedInfo.stock > 0 && (
                  <Button
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      handleAddToCart(selectedMedInfo.id)
                      setIsInfoModalOpen(false)
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    เพิ่มลงรายการ
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fixed bottom bar for cart summary */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex gap-2">
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-baseline gap-1">
              <span className="text-sm">{totalCartItems} รายการ</span>
              <span className="font-bold text-lg">{totalCartValue.toLocaleString()}฿</span>
            </div>
          </div>
          <Button className="px-8" onClick={() => setIsCartOpen(true)}>
            ดูรายการสั่งซื้อ
          </Button>
        </div>
      )}
    </div>
  )
}

// หน้าหลักที่ครอบด้วย Suspense
export default function LiffProductsByOrderPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12">กำลังโหลด...</div>}>
      <ProductsByOrderContent />
    </Suspense>
  )
}
