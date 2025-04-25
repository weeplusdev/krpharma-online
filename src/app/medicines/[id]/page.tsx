import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ShoppingCart, Heart } from "lucide-react"

// Mock data for a single medicine
const medicine = {
  id: 1,
  name: "Paracetamol",
  atcCode: "N02BE01",
  image: "/placeholder.svg",
  strength: "500 mg",
  form: "Tablet",
  description:
    "Paracetamol is a pain reliever and fever reducer. It is used to treat many conditions such as headache, muscle aches, arthritis, backache, toothaches, colds, and fevers.",
  indications: "For the treatment of mild to moderate pain and fever.",
  dosage:
    "Adults and children 12 years and over: 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.",
  sideEffects: "Rare side effects may include rash, nausea, or liver problems.",
  contraindications: "Do not use if you have severe liver disease.",
  price: 50,
  stock: 100,
}

export default function MedicineDetails({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the medicine data based on the ID
  // For this example, we'll use the mock data
  if (Number.parseInt(params.id) !== medicine.id) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/categories/medicines" className="text-primary hover:underline mb-4 inline-block">
        &larr; กลับไปยังรายการยา
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={medicine.image || "/placeholder.svg"}
            alt={medicine.name}
            width={500}
            height={500}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{medicine.name}</h1>
          <p className="text-xl mb-2">ความแรง: {medicine.strength}</p>
          <p className="text-xl mb-4">รูปแบบ: {medicine.form}</p>
          <p className="text-2xl font-bold mb-4">ราคา: {medicine.price} บาท</p>

          <div className="flex items-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${medicine.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {medicine.stock > 0 ? "มีสินค้า" : "สินค้าหมด"}
            </span>
            {medicine.stock > 0 && <span className="ml-2 text-sm text-gray-600">({medicine.stock} ชิ้น)</span>}
          </div>

          <div className="flex space-x-4 mb-8">
            <button className="bg-primary text-white px-6 py-2 rounded-full flex items-center">
              <ShoppingCart className="mr-2" size={20} />
              เพิ่มลงตะกร้า
            </button>
            <button className="border border-primary text-primary px-6 py-2 rounded-full flex items-center">
              <Heart className="mr-2" size={20} />
              เพิ่มในรายการโปรด
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">รายละเอียด</h2>
            <p>{medicine.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">ข้อบ่งใช้</h2>
            <p>{medicine.indications}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">วิธีใช้และขนาดยา</h2>
            <p>{medicine.dosage}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">ผลข้างเคียง</h2>
            <p>{medicine.sideEffects}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">ข้อห้ามใช้</h2>
            <p>{medicine.contraindications}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

