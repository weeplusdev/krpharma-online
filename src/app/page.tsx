import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function HomePage() {
  // ดึง user-agent จาก headers
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""

  // ตรวจสอบว่าเป็น LINE หรือไม่
  const isLineApp = userAgent.includes("Line") || userAgent.includes("LIFF") || userAgent.includes("LINE")

  // ถ้าเป็น LINE ให้ redirect ไปที่ /liff ไม่ใช่ให้ไปที่ /web
  if (isLineApp) {
    redirect("/liff")
  } else {
    redirect("/web")
  }
}

// Sample data
const categories = [
  { id: "health-condition", name: "สุขภาพทั่วไป", image: "/placeholder.svg?height=40&width=40" },
  { id: "bandage", name: "ผ้าพันแผล", image: "/placeholder.svg?height=40&width=40" },
  { id: "covid", name: "อุปกรณ์ป้องกันโควิด", image: "/placeholder.svg?height=40&width=40" },
  { id: "mother-baby", name: "แม่และเด็ก", image: "/placeholder.svg?height=40&width=40" },
  { id: "supplements", name: "อาหารเสริม", image: "/placeholder.svg?height=40&width=40" },
  { id: "elderly", name: "ผู้สูงอายุ", image: "/placeholder.svg?height=40&width=40" },
  { id: "medical-supplies", name: "เวชภัณฑ์", image: "/placeholder.svg?height=40&width=40" },
]

const newArrivals = [
  {
    id: "1",
    name: "หูฟังแพทย์ Littmann Classic III",
    price: 2950,
    image: "/placeholder.svg?height=150&width=150",
    isNew: true,
  },
  {
    id: "2",
    name: "ชุดตรวจโควิด Antigen Test Kit",
    price: 250,
    originalPrice: 350,
    image: "/placeholder.svg?height=150&width=150",
    discount: 30,
  },
  {
    id: "3",
    name: "เครื่องวัดอุณหภูมิทางหน้าผากแบบอินฟราเรด",
    price: 1290,
    originalPrice: 1590,
    image: "/placeholder.svg?height=150&width=150",
    discount: 20,
  },
  {
    id: "4",
    name: "เจลล้างมือแอลกอฮอล์ 75% ขนาด 300 มล.",
    price: 120,
    originalPrice: 150,
    image: "/placeholder.svg?height=150&width=150",
    discount: 20,
  },
  {
    id: "5",
    name: "ถุงมือยางทางการแพทย์ (50 คู่)",
    price: 350,
    image: "/placeholder.svg?height=150&width=150",
    isNew: true,
  },
]

const healthConcerns = [
  { id: "stomach", name: "ระบบทางเดินอาหาร", icon: "/placeholder.svg?height=24&width=24" },
  { id: "pregnant", name: "ตั้งครรภ์", icon: "/placeholder.svg?height=24&width=24" },
  { id: "cardiac", name: "หัวใจ", icon: "/placeholder.svg?height=24&width=24" },
  { id: "respiratory", name: "ระบบหายใจ", icon: "/placeholder.svg?height=24&width=24" },
  { id: "runny-nose", name: "น้ำมูกไหล", icon: "/placeholder.svg?height=24&width=24" },
  { id: "covid", name: "โควิด", icon: "/placeholder.svg?height=24&width=24" },
  { id: "sick", name: "ไข้หวัด", icon: "/placeholder.svg?height=24&width=24" },
  { id: "headache", name: "ปวดศีรษะ", icon: "/placeholder.svg?height=24&width=24" },
  { id: "fever", name: "ไข้", icon: "/placeholder.svg?height=24&width=24" },
]
