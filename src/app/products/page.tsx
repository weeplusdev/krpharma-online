"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, Heart, List, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Product = {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  subcategory: string
  inStock: boolean
  rating: number
  popular: boolean
  isNew?: boolean
}

export default function ProductsPage() {
  const [activeView, setActiveView] = useState("grid")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("popular")
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)

  // ตรวจสอบว่าเป็น client-side หรือไม่
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Apply price filter
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory)

      if (selectedSubcategory) {
        result = result.filter((product) => product.subcategory === selectedSubcategory)
      }
    }

    // Apply in-stock filter
    if (inStockOnly) {
      result = result.filter((product) => product.inStock)
    }

    // Apply sorting
    switch (sortBy) {
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
        result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
        break
    }

    return result
  }, [products, priceRange, selectedCategory, selectedSubcategory, inStockOnly, sortBy])

  // Toggle wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p>กำลังโหลด...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="bg-sky-100 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start">
              <h1 className="text-3xl font-bold mb-2">สินค้า</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">
                  หน้าหลัก
                </Link>
                <span className="mx-2">/</span>
                <span>สินค้า</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <div className="sticky top-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">ตัวกรอง</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedSubcategory(null)
                      setPriceRange([0, 5000])
                      setInStockOnly(false)
                    }}
                  >
                    ล้างทั้งหมด
                  </Button>
                </div>

                <Accordion type="single" collapsible defaultValue="availability">
                  <AccordionItem value="availability">
                    <AccordionTrigger className="text-base font-medium">สถานะสินค้า</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="in-stock"
                            checked={inStockOnly}
                            onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                          />
                          <label
                            htmlFor="in-stock"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            มีสินค้า
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="out-of-stock" disabled />
                          <label
                            htmlFor="out-of-stock"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            สินค้าหมด
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price">
                    <AccordionTrigger className="text-base font-medium">ราคา</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider
                          defaultValue={[0, 5000]}
                          max={5000}
                          step={100}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex items-center justify-between">
                          <div className="border rounded-md px-3 py-1">
                            <span className="text-sm">฿{priceRange[0]}</span>
                          </div>
                          <div className="border rounded-md px-3 py-1">
                            <span className="text-sm">฿{priceRange[1]}</span>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="category">
                    <AccordionTrigger className="text-base font-medium">หมวดหมู่</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={category.id}
                                checked={selectedCategory === category.id}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCategory(category.id)
                                    setSelectedSubcategory(null)
                                  } else if (selectedCategory === category.id) {
                                    setSelectedCategory(null)
                                  }
                                }}
                              />
                              <label
                                htmlFor={category.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category.name}
                              </label>
                            </div>

                            {selectedCategory === category.id && category.subcategories && (
                              <div className="ml-6 space-y-2">
                                {category.subcategories.map((subcategory) => (
                                  <div key={subcategory.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={subcategory.id}
                                      checked={selectedSubcategory === subcategory.id}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedSubcategory(subcategory.id)
                                        } else if (selectedSubcategory === subcategory.id) {
                                          setSelectedSubcategory(null)
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={subcategory.id}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {subcategory.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="brand">
                    <AccordionTrigger className="text-base font-medium">แบรนด์</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <div key={brand.id} className="flex items-center space-x-2">
                            <Checkbox id={`brand-${brand.id}`} />
                            <label
                              htmlFor={`brand-${brand.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {brand.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="color">
                    <AccordionTrigger className="text-base font-medium">สี</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                        <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                        <div className="w-8 h-8 rounded-full bg-yellow-500 cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-500 cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                        <div className="w-8 h-8 rounded-full bg-black cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                        <div className="w-8 h-8 rounded-full bg-white cursor-pointer border-2 border-gray-200 hover:border-gray-400"></div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="size">
                    <AccordionTrigger className="text-base font-medium">ขนาด</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-3">
                          S
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3">
                          M
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3">
                          L
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3">
                          XL
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold mb-2">ต้องการความช่วยเหลือ?</h3>
                  <p className="text-sm text-muted-foreground mb-3">ติดต่อเภสัชกรของเราได้ตลอด 24 ชั่วโมง</p>
                  <Button className="w-full">ปรึกษาเภสัชกร</Button>
                </div>
              </div>
            </div>

            {/* Product Listing */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-semibold">สินค้าทั้งหมด</h2>
                  <p className="text-sm text-muted-foreground">แสดง {filteredProducts.length} รายการ</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="เรียงตาม" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">ความนิยม</SelectItem>
                      <SelectItem value="price-asc">ราคา: ต่ำไปสูง</SelectItem>
                      <SelectItem value="price-desc">ราคา: สูงไปต่ำ</SelectItem>
                      <SelectItem value="name">ชื่อ: A-Z</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-md">
                    <Button
                      variant={activeView === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none rounded-l-md"
                      onClick={() => setActiveView("grid")}
                    >
                      <Grid size={16} />
                    </Button>
                    <Separator orientation="vertical" />
                    <Button
                      variant={activeView === "list" ? "default" : "ghost"}
                      size="icon"
                      className="h-9 w-9 rounded-none rounded-r-md"
                      onClick={() => setActiveView("list")}
                    >
                      <List size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory ||
                selectedSubcategory ||
                inStockOnly ||
                priceRange[0] > 0 ||
                priceRange[1] < 5000) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategory && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {categories.find((c) => c.id === selectedCategory)?.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => {
                          setSelectedCategory(null)
                          setSelectedSubcategory(null)
                        }}
                      >
                        <span className="sr-only">Remove</span>×
                      </Button>
                    </Badge>
                  )}

                  {selectedSubcategory && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {
                        categories
                          .find((c) => c.id === selectedCategory)
                          ?.subcategories?.find((s) => s.id === selectedSubcategory)?.name
                      }
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => setSelectedSubcategory(null)}
                      >
                        <span className="sr-only">Remove</span>×
                      </Button>
                    </Badge>
                  )}

                  {inStockOnly && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      มีสินค้า
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

                  {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      ฿{priceRange[0]} - ฿{priceRange[1]}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => setPriceRange([0, 5000])}
                      >
                        <span className="sr-only">Remove</span>×
                      </Button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Grid View */}
              {activeView === "grid" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden group">
                      <div className="relative">
                        <Link href={`/products/${product.id}`}>
                          <div className="aspect-square bg-muted/30 p-4">
                            {product.discount && (
                              <Badge className="absolute top-2 left-2 z-10 bg-red-500">-{product.discount}%</Badge>
                            )}
                            {product.isNew && <Badge className="absolute top-2 right-2 z-10 bg-blue-500">ใหม่</Badge>}
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={200}
                              height={200}
                              className="object-contain w-full h-full transition-transform group-hover:scale-105"
                            />
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                          onClick={() => handleToggleWishlist(product.id)}
                        >
                          <Heart
                            size={18}
                            className={wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}
                          />
                        </Button>
                      </div>
                      <div className="p-4">
                        <Link href={`/products/${product.id}`} className="hover:underline">
                          <h3 className="font-medium line-clamp-2 mb-1">{product.name}</h3>
                        </Link>
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-bold text-primary">฿{product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ฿{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Button className="w-full" disabled={!product.inStock}>
                          {product.inStock ? (
                            <>
                              <ShoppingCart size={16} className="mr-2" />
                              เพิ่มลงตะกร้า
                            </>
                          ) : (
                            "สินค้าหมด"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {activeView === "list" && (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden flex">
                      <div className="relative w-40 sm:w-48">
                        <Link href={`/products/${product.id}`}>
                          <div className="h-full bg-muted/30 p-4">
                            {product.discount && (
                              <Badge className="absolute top-2 left-2 z-10 bg-red-500">-{product.discount}%</Badge>
                            )}
                            {product.isNew && <Badge className="absolute top-2 right-2 z-10 bg-blue-500">ใหม่</Badge>}
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={160}
                              height={160}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </Link>
                      </div>
                      <div className="p-4 flex-1">
                        <Link href={`/products/${product.id}`} className="hover:underline">
                          <h3 className="font-medium mb-1">{product.name}</h3>
                        </Link>
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-bold text-primary">฿{product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ฿{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button disabled={!product.inStock}>
                            {product.inStock ? (
                              <>
                                <ShoppingCart size={16} className="mr-2" />
                                เพิ่มลงตะกร้า
                              </>
                            ) : (
                              "สินค้าหมด"
                            )}
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleToggleWishlist(product.id)}>
                            <Heart
                              size={18}
                              className={wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <Button variant="outline" size="icon" disabled>
                    <span className="sr-only">Previous</span>
                    &lt;
                  </Button>
                  <Button variant="outline" size="icon" className="bg-primary text-primary-foreground">
                    1
                  </Button>
                  <Button variant="outline" size="icon">
                    2
                  </Button>
                  <Button variant="outline" size="icon">
                    3
                  </Button>
                  <span className="px-2">...</span>
                  <Button variant="outline" size="icon">
                    10
                  </Button>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">Next</span>
                    &gt;
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Sample data
const categories = [
  {
    id: "medical-equipment",
    name: "เครื่องมือทางการแพทย์",
    subcategories: [
      { id: "thermometer", name: "เครื่องวัดอุณหภูมิ" },
      { id: "blood-pressure", name: "เครื่องวัดความดัน" },
      { id: "stethoscope", name: "หูฟังแพทย์" },
      { id: "masks", name: "หน้ากากอนามัย" },
    ],
  },
  {
    id: "covid",
    name: "อุปกรณ์ป้องกันโควิด",
    subcategories: [
      { id: "masks", name: "หน้ากากอนามัย" },
      { id: "sanitizer", name: "เจลล้างมือ" },
      { id: "gloves", name: "ถุงมือ" },
      { id: "test-kit", name: "ชุดตรวจโควิด" },
    ],
  },
  {
    id: "supplements",
    name: "อาหารเสริมและวิตามิน",
    subcategories: [
      { id: "vitamins", name: "วิตามิน" },
      { id: "minerals", name: "แร่ธาตุ" },
      { id: "herbs", name: "สมุนไพร" },
    ],
  },
  {
    id: "personal-care",
    name: "ผลิตภัณฑ์ดูแลส่วนบุคคล",
    subcategories: [
      { id: "skincare", name: "ดูแลผิว" },
      { id: "haircare", name: "ดูแลเส้นผม" },
      { id: "oral-care", name: "ดูแลช่องปาก" },
    ],
  },
  {
    id: "first-aid",
    name: "อุปกรณ์ปฐมพยาบาล",
    subcategories: [
      { id: "bandages", name: "ผ้าพันแผล" },
      { id: "antiseptics", name: "ยาฆ่าเชื้อ" },
      { id: "first-aid-kits", name: "ชุดปฐมพยาบาล" },
    ],
  },
]

const brands = [
  { id: "omron", name: "Omron" },
  { id: "beurer", name: "Beurer" },
  { id: "littmann", name: "Littmann" },
  { id: "3m", name: "3M" },
  { id: "blackmores", name: "Blackmores" },
  { id: "centrum", name: "Centrum" },
]

const products: Product[] = [
  {
    id: "1",
    name: "เครื่องวัดความดันโลหิตดิจิตอล Omron HEM-7120",
    description: "เครื่องวัดความดันโลหิตอัตโนมัติแบบพกพา ใช้งานง่าย แม่นยำสูง ใช้ได้ทั้งที่บ้านและพกพาเดินทาง",
    price: 1990,
    originalPrice: 2490,
    discount: 20,
    image: "/placeholder.svg?height=200&width=200",
    category: "medical-equipment",
    subcategory: "blood-pressure",
    inStock: true,
    rating: 4,
    popular: true,
  },
  {
    id: "2",
    name: "เทอร์โมมิเตอร์วัดไข้ทางหน้าผากแบบอินฟราเรด",
    description: "เครื่องวัดอุณหภูมิแบบไม่สัมผัส วัดได้รวดเร็วภายใน 1 วินาที แม่นยำสูง เหมาะสำหรับเด็กและผู้ใหญ่",
    price: 1290,
    originalPrice: 1590,
    discount: 20,
    image: "/placeholder.svg?height=200&width=200",
    category: "medical-equipment",
    subcategory: "thermometer",
    inStock: true,
    rating: 5,
    popular: true,
    isNew: true,
  },
  {
    id: "3",
    name: "หน้ากาก N95 (แพ็ค 10 ชิ้น)",
    description: "หน้ากากป้องกันฝุ่นละออง PM2.5 และเชื้อโรค กรองอนุภาคได้ถึง 95% ใส่สบาย หายใจสะดวก",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    category: "covid",
    subcategory: "masks",
    inStock: true,
    rating: 4,
    popular: false,
  },
  {
    id: "4",
    name: "เจลล้างมือแอลกอฮอล์ 75% ขนาด 300 มล.",
    description: "เจลล้างมือแอลกอฮอล์ความเข้มข้น 75% ฆ่าเชื้อโรคได้อย่างมีประสิทธิภาพ ไม่ต้องล้างออก พกพาสะดวก",
    price: 120,
    originalPrice: 150,
    discount: 20,
    image: "/placeholder.svg?height=200&width=200",
    category: "covid",
    subcategory: "sanitizer",
    inStock: true,
    rating: 4,
    popular: true,
  },
  {
    id: "5",
    name: "ถุงมือยางทางการแพทย์ (50 คู่)",
    description: "ถุงมือยางทางการแพทย์คุณภาพสูง ป้องกันการสัมผัสเชื้อโรค ใช้แล้วทิ้ง สำหรับงานทางการแพทย์และการดูแลผู้ป่วย",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    category: "covid",
    subcategory: "gloves",
    inStock: true,
    rating: 3,
    popular: false,
  },
  {
    id: "6",
    name: "ชุดตรวจโควิด Antigen Test Kit (ATK)",
    description: "ชุดตรวจโควิด-19 ด้วยตนเอง ให้ผลภายใน 15 นาที ใช้งานง่าย แม่นยำสูง ได้รับการรับรองจาก อย.",
    price: 250,
    originalPrice: 350,
    discount: 30,
    image: "/placeholder.svg?height=200&width=200",
    category: "covid",
    subcategory: "test-kit",
    inStock: false,
    rating: 4,
    popular: true,
  },
  {
    id: "7",
    name: "วิตามินซี 1000 มก. (60 เม็ด)",
    description: "วิตามินซีเข้มข้น ช่วยเสริมภูมิคุ้มกัน ต้านอนุมูลอิสระ ลดความเสี่ยงของโรคหวัด บำรุงผิวพรรณให้สดใส",
    price: 450,
    image: "/placeholder.svg?height=200&width=200",
    category: "supplements",
    subcategory: "vitamins",
    inStock: true,
    rating: 5,
    popular: true,
  },
  {
    id: "8",
    name: "หูฟังแพทย์ Littmann Classic III",
    description: "หูฟังแพทย์คุณภาพสูง ให้เสียงคมชัด แยกเสียงได้ดี น้ำหนักเบา ทนทาน เหมาะสำหรับแพทย์และพยาบาล",
    price: 2950,
    image: "/placeholder.svg?height=200&width=200",
    category: "medical-equipment",
    subcategory: "stethoscope",
    inStock: true,
    rating: 5,
    popular: false,
    isNew: true,
  },
  {
    id: "9",
    name: "ผ้าพันแผลยืดหยุ่น 4 นิ้ว (12 ม้วน)",
    description: "ผ้าพันแผลคุณภาพสูง ยืดหยุ่นได้ดี ระบายอากาศ ใช้สำหรับพันแผล รัดกล้ามเนื้อ หรือข้อต่อที่บาดเจ็บ",
    price: 480,
    image: "/placeholder.svg?height=200&width=200",
    category: "first-aid",
    subcategory: "bandages",
    inStock: true,
    rating: 4,
    popular: false,
  },
  {
    id: "10",
    name: "น้ำยาฆ่าเชื้อ Betadine 100 มล.",
    description: "น้ำยาฆ่าเชื้อโรคสำหรับแผลเปิด ป้องกันการติดเชื้อ ใช้ทำความสะอาดบาดแผลก่อนปิดพลาสเตอร์หรือผ้าพันแผล",
    price: 120,
    image: "/placeholder.svg?height=200&width=200",
    category: "first-aid",
    subcategory: "antiseptics",
    inStock: true,
    rating: 4,
    popular: false,
  },
  {
    id: "11",
    name: "ชุดปฐมพยาบาลเบื้องต้น 27 ชิ้น",
    description: "ชุดปฐมพยาบาลพกพา ประกอบด้วยอุปกรณ์จำเป็นสำหรับการปฐมพยาบาลเบื้องต้น เหมาะสำหรับใช้ในบ้านหรือเดินทาง",
    price: 350,
    originalPrice: 450,
    discount: 20,
    image: "/placeholder.svg?height=200&width=200",
    category: "first-aid",
    subcategory: "first-aid-kits",
    inStock: true,
    rating: 4,
    popular: true,
  },
  {
    id: "12",
    name: "แคลเซียม 1200 มก. พร้อมวิตามินดี (60 เม็ด)",
    description: "แคลเซียมเสริมวิตามินดี ช่วยบำรุงกระดูกและฟัน ป้องกันโรคกระดูกพรุน เหมาะสำหรับผู้สูงอายุและวัยทำงาน",
    price: 580,
    image: "/placeholder.svg?height=200&width=200",
    category: "supplements",
    subcategory: "minerals",
    inStock: true,
    rating: 4,
    popular: false,
  },
]
