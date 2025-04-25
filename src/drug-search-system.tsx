"use client"

import type React from "react"
import { useState, useMemo } from "react"
import {
  ArrowUpDown,
  Search,
  Filter,
  Star,
  AlertTriangle,
  ShoppingCart,
  Heart,
  X,
  Grid,
  List,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"

// Define types
type Category = {
  id: string
  name: string
  subcategories: Subcategory[]
}

type Subcategory = {
  id: string
  name: string
  count?: number
}

type Medication = {
  id: string
  name: string
  description: string
  price: number
  prescription: boolean
  popular: boolean
  form: string
  category: string
  subcategory: string
  image?: string
}

export default function DrugSearchSystem() {
  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [activeView, setActiveView] = useState("grid")
  const [showPrescriptionAlert, setShowPrescriptionAlert] = useState(false)
  const [selectedDrug, setSelectedDrug] = useState<Medication | null>(null)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])

  // เพิ่ม state สำหรับฟิลเตอร์
  const [activeFilters, setActiveFilters] = useState<{
    category: string | null
    subcategory: string | null
    prescription: boolean | null
    priceRange: [number, number] | null
    form: string | null
  }>({
    category: null,
    subcategory: null,
    prescription: null,
    priceRange: null,
    form: null,
  })
  const [showFilterDialog, setShowFilterDialog] = useState(false)

  // ใช้ Cart Context
  const { addItem } = useCart()

  // Sample data - categories from the provided list
  const categories: Category[] = [
    {
      id: "gastrointestinal",
      name: "ยาระบบทางเดินอาหาร",
      subcategories: [
        { id: "antacid", name: "ยาลดกรด (Antacid & Antiulcerants)" },
        { id: "git-regulators", name: "ยาควบคุมการทำงานของระบบทางเดินอาหารและยาลดแก๊ส" },
        { id: "antispasmodics", name: "ยาคลายกล้ามเนื้อเรียบของระบบทางเดินอาหาร" },
        { id: "antidiarrheals", name: "ยารักษาอาการท้องเสีย" },
        { id: "laxatives", name: "ยาระบาย" },
        { id: "digestives", name: "ยาช่วยย่อยอาหาร" },
        { id: "cholagogues", name: "ยาขับน้ำดีและยาป้องกันตับ" },
      ],
    },
    {
      id: "cardiovascular",
      name: "ยาระบบหัวใจและหลอดเลือด",
      subcategories: [
        { id: "cardiac-drugs", name: "ยารักษาโรคหัวใจ" },
        { id: "anti-anginal", name: "ยารักษาอาการเจ็บหน้าอกจากโรคหัวใจ" },
        { id: "ace-inhibitors", name: "ยายับยั้งเอนไซม์ ACE" },
        { id: "beta-blockers", name: "ยาบล็อกเบต้า" },
        { id: "calcium-antagonists", name: "ยาต้านแคลเซียม" },
        { id: "antihypertensives", name: "ยาลดความดันโลหิตชนิดอื่น ๆ" },
        { id: "diuretics", name: "ยาขับปัสสาวะ" },
      ],
    },
    {
      id: "respiratory",
      name: "ยาระบบทางเดินหายใจ",
      subcategories: [
        { id: "respiratory-stimulants", name: "ยากระตุ้นการหายใจ" },
        { id: "antiasthmatic", name: "ยารักษาโรคหืด" },
        { id: "cough-cold", name: "ยาแก้ไอและยารักษาอาการหวัด" },
        { id: "decongestants", name: "ยาลดอาการคัดจมูกและยารักษาอาการทางจมูกอื่น ๆ" },
      ],
    },
    {
      id: "supplements",
      name: "อาหารเสริม วิตามิน และสมุนไพร",
      subcategories: [
        { id: "vitamins", name: "วิตามิน" },
        { id: "minerals", name: "แร่ธาตุ" },
        { id: "herbs", name: "สมุนไพร" },
        { id: "supplements", name: "อาหารเสริม" },
      ],
    },
    {
      id: "medical-equipment",
      name: "เครื่องมือทางการแพทย์",
      subcategories: [
        { id: "diagnostic", name: "อุปกรณ์วินิจฉัย" },
        { id: "first-aid", name: "อุปกรณ์ปฐมพยาบาล" },
        { id: "mobility", name: "อุปกรณ์ช่วยเคลื่อนไหว" },
      ],
    },
    {
      id: "cosmetics",
      name: "เวชสำอาง",
      subcategories: [
        { id: "skincare", name: "ผลิตภัณฑ์ดูแลผิว" },
        { id: "haircare", name: "ผลิตภัณฑ์ดูแลเส้นผม" },
        { id: "oral-care", name: "ผลิตภัณฑ์ดูแลช่องปาก" },
      ],
    },
  ]

  // Sample medications data
  const allMedications: Medication[] = [
    // Gastrointestinal - Antacid
    {
      id: "a1",
      name: "Omeprazole 20mg",
      description: "ยับยั้งการหลั่งกรดในกระเพาะอาหาร",
      price: 450,
      prescription: true,
      popular: true,
      form: "แคปซูล",
      category: "gastrointestinal",
      subcategory: "antacid",
    },
    {
      id: "a2",
      name: "Ranitidine 150mg",
      description: "ลดการหลั่งกรดในกระเพาะอาหาร",
      price: 280,
      prescription: false,
      popular: false,
      form: "เม็ด",
      category: "gastrointestinal",
      subcategory: "antacid",
    },
    {
      id: "a3",
      name: "Aluminum Hydroxide & Magnesium Hydroxide",
      description: "บรรเทาอาการจุกเสียด แน่นท้อง ท้องอืด",
      price: 120,
      prescription: false,
      popular: true,
      form: "น้ำ",
      category: "gastrointestinal",
      subcategory: "antacid",
    },
    // Gastrointestinal - Antidiarrheals
    {
      id: "d1",
      name: "Loperamide 2mg",
      description: "ยาแก้ท้องเสีย ลดการบีบตัวของลำไส้",
      price: 35,
      prescription: false,
      popular: true,
      form: "เม็ด",
      category: "gastrointestinal",
      subcategory: "antidiarrheals",
    },
    {
      id: "d2",
      name: "Bismuth Subsalicylate",
      description: "บรรเทาอาการท้องเสีย ท้องอืด แน่นท้อง",
      price: 180,
      prescription: false,
      popular: false,
      form: "เม็ดเคี้ยว",
      category: "gastrointestinal",
      subcategory: "antidiarrheals",
    },
    // Gastrointestinal - GIT Regulators
    {
      id: "f1",
      name: "Simethicone 80mg",
      description: "ลดแก๊สในทางเดินอาหาร บรรเทาอาการท้องอืด",
      price: 95,
      prescription: false,
      popular: true,
      form: "เม็ดเคี้ยว",
      category: "gastrointestinal",
      subcategory: "git-regulators",
    },
    // Cardiovascular - Beta Blockers
    {
      id: "bb1",
      name: "Atenolol 50mg",
      description: "รักษาความดันโลหิตสูง และโรคหัวใจขาดเลือด",
      price: 320,
      prescription: true,
      popular: false,
      form: "เม็ด",
      category: "cardiovascular",
      subcategory: "beta-blockers",
    },
    // Respiratory - Cough & Cold
    {
      id: "cc1",
      name: "Dextromethorphan Syrup",
      description: "บรรเทาอาการไอแห้ง",
      price: 85,
      prescription: false,
      popular: true,
      form: "น้ำเชื่อม",
      category: "respiratory",
      subcategory: "cough-cold",
    },
    {
      id: "cc2",
      name: "Bromhexine 8mg",
      description: "ช่วยละลายเสมหะ",
      price: 65,
      prescription: false,
      popular: false,
      form: "เม็ด",
      category: "respiratory",
      subcategory: "cough-cold",
    },
    // Supplements - Vitamins
    {
      id: "v1",
      name: "Vitamin C 1000mg",
      description: "เสริมภูมิคุ้มกัน ต้านอนุมูลอิสระ",
      price: 450,
      prescription: false,
      popular: true,
      form: "เม็ดฟู่",
      category: "supplements",
      subcategory: "vitamins",
    },
  ]

  // Filter medications based on selected filters
  const filteredMedications = useMemo(() => {
    let result = [...allMedications]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (med) => med.name.toLowerCase().includes(query) || med.description.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((med) => med.category === selectedCategory)

      if (selectedSubcategory) {
        result = result.filter((med) => med.subcategory === selectedSubcategory)
      }
    }

    // Apply additional filters
    if (activeFilters.prescription !== null) {
      result = result.filter((med) => med.prescription === activeFilters.prescription)
    }

    if (activeFilters.form) {
      result = result.filter((med) => med.form.toLowerCase() === activeFilters.form?.toLowerCase())
    }

    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange
      result = result.filter((med) => med.price >= min && med.price <= max)
    }

    return result
  }, [selectedCategory, selectedSubcategory, searchQuery, allMedications, activeFilters])

  // Get current category and subcategory objects
  const currentCategory = useMemo(() => {
    return categories.find((cat) => cat.id === selectedCategory)
  }, [selectedCategory, categories])

  const currentSubcategory = useMemo(() => {
    if (!currentCategory || !selectedSubcategory) return null
    return currentCategory.subcategories.find((sub) => sub.id === selectedSubcategory)
  }, [currentCategory, selectedSubcategory])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSearchResults(true)
    // Reset category and subcategory selections when searching
    if (searchQuery) {
      setSelectedCategory(null)
      setSelectedSubcategory(null)
    }
  }

  // Handle add to cart
  const handleAddToCart = (drug: Medication) => {
    if (drug.prescription) {
      setSelectedDrug(drug)
      setShowPrescriptionAlert(true)
    } else {
      // เพิ่มสินค้าลงตะกร้า
      addItem({
        id: drug.id,
        name: drug.name,
        price: drug.price,
        quantity: 1,
        image: drug.image,
        prescription: drug.prescription,
        form: drug.form,
      })

      // แสดงข้อความแจ้งเตือน
      toast.success(`${drug.name} ถูกเพิ่มลงในตะกร้าสินค้าแล้ว`);
    }
  }

  // Handle add to wishlist
  const handleToggleWishlist = (drugId: string) => {
    setWishlist((prev) => {
      if (prev.includes(drugId)) {
        return prev.filter((id) => id !== drugId)
      } else {
        return [...prev, drugId]
      }
    })
  }

  // Reset search
  const resetSearch = () => {
    setSearchQuery("")
    setShowSearchResults(false)
  }

  // Clear filters
  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header with search */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">ค้นหายาและผลิตภัณฑ์สุขภาพ</h1>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
          >
            <Filter size={20} />
          </Button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="ค้นหาตามชื่อยา อาการ หรือประเภท..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={resetSearch}
              >
                <X size={16} />
              </Button>
            )}
          </div>
          <Button type="submit">ค้นหา</Button>
        </form>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - Categories */}
        <aside className={`md:w-64 shrink-0 ${showMobileFilter ? "block" : "hidden"} md:block`}>
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">หมวดหมู่</h2>
              {(selectedCategory || selectedSubcategory) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  ล้างตัวกรอง
                </Button>
              )}
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <Accordion type="multiple" defaultValue={selectedCategory ? [selectedCategory] : []}>
                {categories.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger
                      onClick={() => {
                        setSelectedCategory(category.id)
                        setSelectedSubcategory(null)
                        setShowSearchResults(false)
                      }}
                      className={selectedCategory === category.id ? "font-medium text-primary" : ""}
                    >
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 flex flex-col gap-2">
                        {category.subcategories.map((subcategory) => (
                          <Button
                            key={subcategory.id}
                            variant="ghost"
                            size="sm"
                            className={`justify-start ${
                              selectedSubcategory === subcategory.id ? "bg-primary/10 text-primary font-medium" : ""
                            }`}
                            onClick={() => {
                              setSelectedCategory(category.id)
                              setSelectedSubcategory(subcategory.id)
                              setShowSearchResults(false)
                              setShowMobileFilter(false)
                            }}
                          >
                            {subcategory.name}
                            {subcategory.count && (
                              <Badge variant="outline" className="ml-2">
                                {subcategory.count}
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-grow">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Button variant="link" className="p-0 h-auto" onClick={clearFilters}>
              หน้าหลัก
            </Button>

            {selectedCategory && (
              <>
                <ChevronRight className="mx-1" size={14} />
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => {
                    setSelectedSubcategory(null)
                  }}
                >
                  {currentCategory?.name}
                </Button>
              </>
            )}

            {selectedSubcategory && (
              <>
                <ChevronRight className="mx-1" size={14} />
                <span>{currentSubcategory?.name}</span>
              </>
            )}

            {showSearchResults && (
              <>
                <ChevronRight className="mx-1" size={14} />
                <span>ผลการค้นหา: {searchQuery}</span>
              </>
            )}
          </nav>

          {/* Title and view toggle */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {showSearchResults
                ? `ผลการค้นหา "${searchQuery}" (${filteredMedications.length})`
                : selectedSubcategory
                  ? currentSubcategory?.name
                  : selectedCategory
                    ? currentCategory?.name
                    : "สินค้าทั้งหมด"}
            </h2>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowFilterDialog(true)}
              >
                <Filter size={16} />
                ตัวกรอง
                {Object.values(activeFilters).some((v) => v !== null) && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(activeFilters).filter((v) => v !== null).length}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown size={16} className="mr-2" />
                    เรียงตาม
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>ราคา: ต่ำไปสูง</DropdownMenuItem>
                  <DropdownMenuItem>ราคา: สูงไปต่ำ</DropdownMenuItem>
                  <DropdownMenuItem>ชื่อ: A-Z</DropdownMenuItem>
                  <DropdownMenuItem>ความนิยม</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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

          {/* Results count */}
          {filteredMedications.length > 0 ? (
            <p className="text-sm text-muted-foreground mb-4">แสดง {filteredMedications.length} รายการ</p>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">ไม่พบรายการที่ค้นหา</p>
              <Button variant="link" onClick={clearFilters}>
                ดูสินค้าทั้งหมด
              </Button>
            </div>
          )}

          {/* Active filters */}
          {(Object.values(activeFilters).some((v) => v !== null) || selectedCategory || selectedSubcategory) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {currentCategory?.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedSubcategory(null)
                      setActiveFilters((prev) => ({ ...prev, category: null, subcategory: null }))
                    }}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}

              {selectedSubcategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {currentSubcategory?.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => {
                      setSelectedSubcategory(null)
                      setActiveFilters((prev) => ({ ...prev, subcategory: null }))
                    }}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}

              {activeFilters.prescription !== null && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {activeFilters.prescription ? "ยาที่ต้องมีใบสั่งแพทย์" : "ยาสามัญ"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setActiveFilters((prev) => ({ ...prev, prescription: null }))}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}

              {activeFilters.form && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  รูปแบบ: {activeFilters.form}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setActiveFilters((prev) => ({ ...prev, form: null }))}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}

              {activeFilters.priceRange && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ราคา: {activeFilters.priceRange[0]} - {activeFilters.priceRange[1]} บาท
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setActiveFilters((prev) => ({ ...prev, priceRange: null }))}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}

              {(Object.values(activeFilters).some((v) => v !== null) || selectedCategory || selectedSubcategory) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedSubcategory(null)
                    setActiveFilters({
                      category: null,
                      subcategory: null,
                      prescription: null,
                      priceRange: null,
                      form: null,
                    })
                  }}
                >
                  ล้างตัวกรองทั้งหมด
                </Button>
              )}
            </div>
          )}

          {/* Grid View */}
          {filteredMedications.length > 0 && activeView === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedications.map((drug) => (
                <div key={drug.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <div className="relative">
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                      {drug.image ? (
                        <img
                          src={drug.image || "/placeholder.svg"}
                          alt={drug.name}
                          className="object-contain w-full h-full p-4"
                        />
                      ) : (
                        <div className="text-muted-foreground">ไม่มีรูปภาพ</div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                      onClick={() => handleToggleWishlist(drug.id)}
                    >
                      <Heart size={18} className={wishlist.includes(drug.id) ? "fill-red-500 text-red-500" : ""} />
                    </Button>
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{drug.name}</h3>
                    {drug.popular && <Star className="text-yellow-400 fill-yellow-400" size={18} />}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{drug.description}</p>
                  <p className="text-sm text-muted-foreground mb-2">รูปแบบ: {drug.form}</p>
                  <p className="text-lg font-semibold text-primary mb-2">{drug.price} บาท</p>

                  <div className="flex gap-2 mb-3">
                    {drug.prescription ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle size={12} />
                        ต้องมีใบสั่งแพทย์
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        ยาสามัญ
                      </Badge>
                    )}
                  </div>

                  <Button className="w-full" onClick={() => handleAddToCart(drug)}>
                    <ShoppingCart size={16} className="mr-2" />
                    เพิ่มลงตะกร้า
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {filteredMedications.length > 0 && activeView === "list" && (
            <div className="space-y-4">
              {filteredMedications.map((drug) => (
                <div key={drug.id} className="flex border rounded-lg p-4 hover:shadow-lg transition">
                  <div className="relative w-24 h-24 shrink-0">
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                      {drug.image ? (
                        <img
                          src={drug.image || "/placeholder.svg"}
                          alt={drug.name}
                          className="object-contain w-full h-full p-2"
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground">ไม่มีรูปภาพ</div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6 bg-background/80 backdrop-blur-sm"
                      onClick={() => handleToggleWishlist(drug.id)}
                    >
                      <Heart size={14} className={wishlist.includes(drug.id) ? "fill-red-500 text-red-500" : ""} />
                    </Button>
                  </div>

                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{drug.name}</h3>
                      {drug.popular && <Star className="text-yellow-400 fill-yellow-400" size={18} />}
                    </div>

                    <p className="text-sm text-muted-foreground">{drug.description}</p>
                    <p className="text-sm text-muted-foreground">รูปแบบ: {drug.form}</p>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-semibold text-primary">{drug.price} บาท</p>
                      <Button onClick={() => handleAddToCart(drug)} size="sm">
                        <ShoppingCart size={16} className="mr-2" />
                        เพิ่มลงตะกร้า
                      </Button>
                    </div>

                    <div className="flex gap-2 mt-2">
                      {drug.prescription ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle size={12} />
                          ต้องมีใบสั่งแพทย์
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          ยาสามัญ
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescription Alert Dialog */}
      <Dialog open={showPrescriptionAlert} onOpenChange={setShowPrescriptionAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2" size={20} />
              ใบสั่งยาจำเป็น
            </DialogTitle>
            <DialogDescription>{selectedDrug?.name} จำเป็นต้องมีใบสั่งแพทย์ คุณสามารถดำเนินการได้โดย:</DialogDescription>
          </DialogHeader>

          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>อัพโหลดใบสั่งยาในขั้นตอนการชำระเงิน</li>
            <li>ส่งใบสั่งยาผ่านแชทกับเภสัชกร</li>
            <li>เข้ารับคำปรึกษาออนไลน์กับแพทย์ของเรา</li>
          </ul>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrescriptionAlert(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                // เพิ่มสินค้าที่ต้องมีใบสั่งแพทย์ลงตะกร้า
                if (selectedDrug) {
                  addItem({
                    id: selectedDrug.id,
                    name: selectedDrug.name,
                    price: selectedDrug.price,
                    quantity: 1,
                    image: selectedDrug.image,
                    prescription: selectedDrug.prescription,
                    form: selectedDrug.form,
                  })

                  toast.success(`${selectedDrug.name} ถูกเพิ่มลงในตะกร้าสินค้าแล้ว (ต้องการใบสั่งแพทย์)`);
                }
                setShowPrescriptionAlert(false)
              }}
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile filter overlay */}
      <Dialog open={showMobileFilter} onOpenChange={setShowMobileFilter}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>หมวดหมู่สินค้า</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <Accordion type="multiple" defaultValue={selectedCategory ? [selectedCategory] : []}>
              {categories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setSelectedSubcategory(null)
                      setShowSearchResults(false)
                    }}
                    className={selectedCategory === category.id ? "font-medium text-primary" : ""}
                  >
                    {category.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 flex flex-col gap-2">
                      {category.subcategories.map((subcategory) => (
                        <Button
                          key={subcategory.id}
                          variant="ghost"
                          size="sm"
                          className={`justify-start ${
                            selectedSubcategory === subcategory.id ? "bg-primary/10 text-primary font-medium" : ""
                          }`}
                          onClick={() => {
                            setSelectedCategory(category.id)
                            setSelectedSubcategory(subcategory.id)
                            setShowSearchResults(false)
                            setShowMobileFilter(false)
                          }}
                        >
                          {subcategory.name}
                          {subcategory.count && (
                            <Badge variant="outline" className="ml-2">
                              {subcategory.count}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMobileFilter(false)}>
              ปิด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ตัวกรองขั้นสูง</DialogTitle>
            <DialogDescription>กรองสินค้าตามความต้องการของคุณ</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="category" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="category">หมวดหมู่</TabsTrigger>
              <TabsTrigger value="properties">คุณสมบัติ</TabsTrigger>
              <TabsTrigger value="price">ราคา</TabsTrigger>
            </TabsList>

            <TabsContent value="category" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">ประเภทสินค้า</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={activeFilters.category === "gastrointestinal" ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        category: prev.category === "gastrointestinal" ? null : "gastrointestinal",
                        subcategory: null,
                      }))
                    }
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    ยาระบบทางเดินอาหาร
                  </Button>
                  <Button
                    variant={activeFilters.category === "cardiovascular" ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        category: prev.category === "cardiovascular" ? null : "cardiovascular",
                        subcategory: null,
                      }))
                    }
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                    ยาระบบหัวใจและหลอดเลือด
                  </Button>
                  <Button
                    variant={activeFilters.category === "respiratory" ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        category: prev.category === "respiratory" ? null : "respiratory",
                        subcategory: null,
                      }))
                    }
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                    ยาระบบทางเดินหายใจ
                  </Button>
                  <Button
                    variant={activeFilters.category === "supplements" ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        category: prev.category === "supplements" ? null : "supplements",
                        subcategory: null,
                      }))
                    }
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                    อาหารเสริม วิตามิน
                  </Button>
                  <Button
                    variant={activeFilters.category === "medical-equipment" ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        category: prev.category === "medical-equipment" ? null : "medical-equipment",
                        subcategory: null,
                      }))
                    }
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
                    เครื่องมือทางการแพทย์
                  </Button>
                  <Button
                    variant={activeFilters.category === "cosmetics" ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        category: prev.category === "cosmetics" ? null : "cosmetics",
                        subcategory: null,
                      }))
                    }
                  >
                    <div className="w-2 h-2 rounded-full bg-pink-500 mr-2" />
                    เวชสำอาง
                  </Button>
                </div>
              </div>

              {activeFilters.category && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">หมวดหมู่ย่อย</h3>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-2">
                      {categories
                        .find((cat) => cat.id === activeFilters.category)
                        ?.subcategories.map((subcat) => (
                          <Button
                            key={subcat.id}
                            variant={activeFilters.subcategory === subcat.id ? "default" : "outline"}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() =>
                              setActiveFilters((prev) => ({
                                ...prev,
                                subcategory: prev.subcategory === subcat.id ? null : subcat.id,
                              }))
                            }
                          >
                            {subcat.name}
                          </Button>
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">ประเภทยา</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={activeFilters.prescription === false ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        prescription: prev.prescription === false ? null : false,
                      }))
                    }
                  >
                    ยาสามัญ
                  </Button>
                  <Button
                    variant={activeFilters.prescription === true ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        prescription: prev.prescription === true ? null : true,
                      }))
                    }
                  >
                    ยาที่ต้องมีใบสั่งแพทย์
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">รูปแบบยา</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={activeFilters.form === "เม็ด" ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        form: prev.form === "เม็ด" ? null : "เม็ด",
                      }))
                    }
                  >
                    ยาเม็ด
                  </Button>
                  <Button
                    variant={activeFilters.form === "แคปซูล" ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        form: prev.form === "แคปซูล" ? null : "แคปซูล",
                      }))
                    }
                  >
                    แคปซูล
                  </Button>
                  <Button
                    variant={activeFilters.form === "น้ำ" ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        form: prev.form === "น้ำ" ? null : "น้ำ",
                      }))
                    }
                  >
                    ยาน้ำ
                  </Button>
                  <Button
                    variant={activeFilters.form === "เม็ดเคี้ยว" ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        form: prev.form === "เม็ดเคี้ยว" ? null : "เม็ดเคี้ยว",
                      }))
                    }
                  >
                    เม็ดเคี้ยว
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="price" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">ช่วงราคา</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={activeFilters.priceRange && activeFilters.priceRange[1] === 100 ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        priceRange: prev.priceRange && prev.priceRange[1] === 100 ? null : [0, 100],
                      }))
                    }
                  >
                    ต่ำกว่า 100 บาท
                  </Button>
                  <Button
                    variant={
                      activeFilters.priceRange &&
                      activeFilters.priceRange[0] === 100 &&
                      activeFilters.priceRange[1] === 300
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        priceRange:
                          prev.priceRange && prev.priceRange[0] === 100 && prev.priceRange[1] === 300
                            ? null
                            : [100, 300],
                      }))
                    }
                  >
                    100 - 300 บาท
                  </Button>
                  <Button
                    variant={
                      activeFilters.priceRange &&
                      activeFilters.priceRange[0] === 300 &&
                      activeFilters.priceRange[1] === 500
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        priceRange:
                          prev.priceRange && prev.priceRange[0] === 300 && prev.priceRange[1] === 500
                            ? null
                            : [300, 500],
                      }))
                    }
                  >
                    300 - 500 บาท
                  </Button>
                  <Button
                    variant={activeFilters.priceRange && activeFilters.priceRange[0] === 500 ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        priceRange: prev.priceRange && prev.priceRange[0] === 500 ? null : [500, 10000],
                      }))
                    }
                  >
                    มากกว่า 500 บาท
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setActiveFilters({
                  category: null,
                  subcategory: null,
                  prescription: null,
                  priceRange: null,
                  form: null,
                })
              }
            >
              ล้างตัวกรอง
            </Button>
            <Button
              onClick={() => {
                // Apply filters to main view
                if (activeFilters.category) {
                  setSelectedCategory(activeFilters.category)
                  if (activeFilters.subcategory) {
                    setSelectedSubcategory(activeFilters.subcategory)
                  }
                }
                setShowFilterDialog(false)
              }}
            >
              ใช้ตัวกรอง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
