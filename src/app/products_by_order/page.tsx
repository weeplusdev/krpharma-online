"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Search, Filter, ArrowUpDown, ShoppingCart, Info, AlertTriangle, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { atcCategories, professionalMedications } from "@/lib/atc-data"
import { OrderHistory } from "@/components/order-history"

export default function ProductsByOrderPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isShowModal, setIsShowModal] = useState(false)
  const [selectedMed, setSelectedMed] = useState<string | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [sortOption, setSortOption] = useState("popular")
  const [prescriptionOnly, setPrescriptionOnly] = useState(false)
  const [professionalOnly, setProfessionalOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({})

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
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
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
    setIsShowModal(true)
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="bg-primary/10 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold mb-2">การสั่งซื้อสำหรับบุคลากรทางการแพทย์</h1>
              <p className="text-muted-foreground mb-4">
                เลือกยาและเวชภัณฑ์คุณภาพสูงในราคาพิเศษสำหรับโรงพยาบาล คลินิก และบุคลากรทางการแพทย์โดยเฉพาะ
              </p>
              <Button asChild className="mt-2">
                <Link href="/orders/new">ลงทะเบียนเพื่อรับสิทธิพิเศษ</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="products">รายการยา</TabsTrigger>
              <TabsTrigger value="history">ประวัติการสั่งซื้อ</TabsTrigger>
            </TabsList>

            {/* แท็บรายการสินค้า */}
            <TabsContent value="products">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* ตัวกรองด้านซ้าย */}
                <aside className="w-full lg:w-1/4 order-2 lg:order-1">
                  <div className="sticky top-4 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">ตัวกรอง</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(null)
                          setSelectedSubCategory(null)
                          setPrescriptionOnly(false)
                          setProfessionalOnly(false)
                          setInStockOnly(false)
                          setPriceRange([0, 2000])
                        }}
                      >
                        ล้างทั้งหมด
                      </Button>
                    </div>

                    <div className="lg:hidden">
                      <Button
                        variant="outline"
                        className="w-full flex justify-between items-center"
                        onClick={() => setShowFilter(!showFilter)}
                      >
                        <span>ตัวกรอง</span>
                        <Filter size={16} />
                      </Button>
                    </div>

                    <div className={`space-y-6 ${showFilter ? "block" : "hidden lg:block"}`}>
                      <Accordion type="single" collapsible defaultValue="atc">
                        <AccordionItem value="atc">
                          <AccordionTrigger>หมวดหมู่ตามระบบ ATC</AccordionTrigger>
                          <AccordionContent>
                            <ScrollArea className="h-[300px] pr-4">
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
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="type">
                          <AccordionTrigger>ประเภทยา</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div className="flex items-start space-x-2">
                                <Checkbox
                                  id="prescription"
                                  checked={prescriptionOnly}
                                  onCheckedChange={(checked) => setPrescriptionOnly(!!checked)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor="prescription"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    ยาควบคุมพิเศษ
                                  </label>
                                  <p className="text-sm text-muted-foreground">แสดงเฉพาะยาที่ต้องมีใบสั่งยา</p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-2">
                                <Checkbox
                                  id="professional"
                                  checked={professionalOnly}
                                  onCheckedChange={(checked) => setProfessionalOnly(!!checked)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor="professional"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    เฉพาะบุคลากรทางการแพทย์
                                  </label>
                                  <p className="text-sm text-muted-foreground">แสดงเฉพาะยาที่จำหน่ายให้บุคลากรทางการแพทย์</p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-2">
                                <Checkbox
                                  id="instock"
                                  checked={inStockOnly}
                                  onCheckedChange={(checked) => setInStockOnly(!!checked)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor="instock"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    มีสินค้าพร้อมจำหน่าย
                                  </label>
                                  <p className="text-sm text-muted-foreground">แสดงเฉพาะยาที่มีในสต็อก</p>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="price">
                          <AccordionTrigger>ช่วงราคา</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label htmlFor="min-price" className="text-sm">
                                    ต่ำสุด (฿)
                                  </label>
                                  <Input
                                    id="min-price"
                                    type="number"
                                    min="0"
                                    value={priceRange[0]}
                                    onChange={(e) =>
                                      setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])
                                    }
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label htmlFor="max-price" className="text-sm">
                                    สูงสุด (฿)
                                  </label>
                                  <Input
                                    id="max-price"
                                    type="number"
                                    min="0"
                                    value={priceRange[1]}
                                    onChange={(e) =>
                                      setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 2000])
                                    }
                                    className="mt-1"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => setPriceRange([0, 500])}
                                >
                                  ไม่เกิน 500฿
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => setPriceRange([500, 1000])}
                                >
                                  500฿ - 1,000฿
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => setPriceRange([1000, 2000])}
                                >
                                  มากกว่า 1,000฿
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {/* ตะกร้า */}
                    {totalCartItems > 0 && (
                      <div className="border rounded-lg p-4 bg-muted/30 space-y-3 mt-6">
                        <h3 className="font-semibold">รายการที่เลือก</h3>
                        <div className="space-y-2">
                          {Object.entries(cartItems).map(([id, qty]) => {
                            const med = professionalMedications.find((m) => m.id === id)
                            if (!med) return null
                            return (
                              <div key={id} className="flex justify-between items-center text-sm">
                                <span className="line-clamp-1 flex-1">{med.name}</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => handleRemoveFromCart(id)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-6 text-center">{qty}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => handleAddToCart(id)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center text-sm">
                          <span>รวมทั้งสิ้น:</span>
                          <span className="font-bold">{totalCartValue.toLocaleString()} บาท</span>
                        </div>
                        <Button className="w-full" asChild>
                          <Link href="/checkout">ดำเนินการสั่งซื้อ ({totalCartItems} รายการ)</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </aside>

                {/* รายการสินค้าด้านขวา */}
                <div className="w-full lg:w-3/4 order-1 lg:order-2">
                  {/* Search & Sort bar */}
                  <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        type="text"
                        placeholder="ค้นหายาตามชื่อหรือคำอธิบาย..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-2 min-w-[150px]">
                          <ArrowUpDown size={16} />
                          <span>
                            {sortOption === "popular" && "ความนิยม"}
                            {sortOption === "price-low" && "ราคา: ต่ำ-สูง"}
                            {sortOption === "price-high" && "ราคา: สูง-ต่ำ"}
                            {sortOption === "name" && "ชื่อ: A-Z"}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setSortOption("popular")}>ความนิยม</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSortOption("price-low")}>ราคา: ต่ำไปสูง</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSortOption("price-high")}>ราคา: สูงไปต่ำ</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSortOption("name")}>ชื่อ: A-Z</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Active filters */}
                  {(selectedCategory ||
                    selectedSubCategory ||
                    prescriptionOnly ||
                    professionalOnly ||
                    inStockOnly ||
                    priceRange[0] > 0 ||
                    priceRange[1] < 2000) && (
                    <div className="flex flex-wrap gap-2 mb-4">
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

                      {professionalOnly && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          เฉพาะบุคลากรทางการแพทย์
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 p-0"
                            onClick={() => setProfessionalOnly(false)}
                          >
                            <span className="sr-only">Remove</span>×
                          </Button>
                        </Badge>
                      )}

                      {inStockOnly && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          มีสินค้าพร้อมจำหน่าย
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 p-0"
                            onClick={() => setInStockOnly(false)}
                          >
                            <span className="sr-only">Remove</span>×
                          </Button>
                        </Badge>
                      )}

                      {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          ราคา: {priceRange[0]} - {priceRange[1]} บาท
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

                  {/* Results */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">พบ {filteredMedications.length} รายการ</p>
                  </div>

                  {/* Medication Grid */}
                  {filteredMedications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMedications.map((med) => (
                        <Card key={med.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="relative bg-muted/30 aspect-video">
                              <Image
                                src={med.image || "/placeholder.svg"}
                                alt={med.name}
                                fill
                                className="object-contain p-4"
                              />
                              {med.discount && (
                                <Badge className="absolute top-2 left-2 z-10 bg-red-500">-{med.discount}%</Badge>
                              )}
                              {med.professionalOnly && (
                                <Badge className="absolute bottom-2 left-2 z-10 bg-primary">เฉพาะบุคลากร</Badge>
                              )}
                              <Button
                                variant="secondary"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={() => handleShowMedInfo(med.id)}
                              >
                                <Info size={16} />
                              </Button>
                            </div>
                            <div className="p-4 space-y-3">
                              <Link href={`/products_by_order/${med.id}`}>
                                <h3 className="font-medium hover:underline line-clamp-2">{med.name}</h3>
                              </Link>

                              <div className="text-sm text-muted-foreground">
                                <div className="flex justify-between">
                                  <span>ความแรง:</span>
                                  <span className="font-medium">{med.strength}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>รูปแบบ:</span>
                                  <span className="font-medium">{med.form}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>ขนาดบรรจุ:</span>
                                  <span className="font-medium">
                                    {med.unitsPerPackage} {med.form}/กล่อง
                                  </span>
                                </div>
                              </div>

                              {med.requiresPrescription && (
                                <div className="flex items-center gap-2 text-amber-600 text-xs">
                                  <AlertTriangle size={14} />
                                  <span>ต้องมีใบสั่งยาจากแพทย์</span>
                                </div>
                              )}

                              <div className="flex items-baseline justify-between">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-bold text-primary">{med.price.toFixed(2)} บาท</span>
                                  {med.originalPrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {med.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {med.stock > 0 ? `มี ${med.stock} ชิ้น` : "สินค้าหมด"}
                                </span>
                              </div>

                              {med.stock > 0 ? (
                                cartItems[med.id] ? (
                                  <div className="flex items-center justify-between">
                                    <Button variant="outline" size="sm" onClick={() => handleRemoveFromCart(med.id)}>
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="font-medium">{cartItems[med.id]}</span>
                                    <Button variant="outline" size="sm" onClick={() => handleAddToCart(med.id)}>
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button className="w-full" onClick={() => handleAddToCart(med.id)}>
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    เพิ่มลงรายการ
                                  </Button>
                                )
                              ) : (
                                <Button className="w-full" disabled>
                                  สินค้าหมด
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground mb-4">ไม่พบรายการยาที่ตรงกับเงื่อนไข</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCategory(null)
                          setSelectedSubCategory(null)
                          setPrescriptionOnly(false)
                          setProfessionalOnly(false)
                          setInStockOnly(false)
                          setPriceRange([0, 2000])
                          setSearchQuery("")
                        }}
                      >
                        ล้างตัวกรองทั้งหมด
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* แท็บประวัติการสั่งซื้อ */}
            <TabsContent value="history">
              <div className="max-w-5xl mx-auto">
                <OrderHistory />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modal แสดงข้อมูลยา */}
      <Dialog open={isShowModal} onOpenChange={setIsShowModal}>
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
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setIsShowModal(false)}>
                  ปิด
                </Button>
                {selectedMedInfo.stock > 0 && (
                  <Button
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      handleAddToCart(selectedMedInfo.id)
                      setIsShowModal(false)
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

      <Footer />
    </div>
  )
}
