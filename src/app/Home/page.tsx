import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, User } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar */}
      <div className="bg-primary text-white py-2 px-4 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <Image src="/logo.svg" alt="KR Pharma Logo" width={40} height={40} />
          <span>KR Pharma</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Email: contact@krpharma.com</span>
          <span>Tel: 02-123-4567</span>
          <span>123 ถนนสุขุมวิท กรุงเทพฯ</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-4">
              <Link href="/" className="text-gray-800 hover:text-primary">
                หน้าหลัก
              </Link>
              <Link href="/categories" className="text-gray-800 hover:text-primary">
                หมวดหมู่สินค้า
              </Link>
              <Link href="/pharmacist-advice" className="text-gray-800 hover:text-primary">
                คำแนะนำเภสัชกร
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-800 hover:text-primary">
                <Search size={20} />
              </button>
              <Link href="/register" className="text-gray-800 hover:text-primary">
                <User size={20} />
              </Link>
              <Link href="/cart" className="text-gray-800 hover:text-primary">
                <ShoppingCart size={20} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">ยินดีต้อนรับสู่ KR Pharma</h1>
            <p className="text-xl mb-8">ร้านขายยาออนไลน์ที่ให้บริการครบวงจร พร้อมคำแนะนำจากเภสัชกรมืออาชีพ</p>
            <Link
              href="/categories"
              className="bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-primary-dark transition duration-300"
            >
              ซื้อสินค้า
            </Link>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">หมวดหมู่สินค้า</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {["ยา", "เครื่องมือแพทย์", "เวชสำอาง", "อาหารเสริม"].map((category) => (
              <div key={category} className="bg-white shadow-md rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <Link
                  href={`/categories/${category.toLowerCase() === "ยา" ? "medicines" : category.toLowerCase()}`}
                  className="text-primary hover:underline"
                >
                  ดูสินค้า
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pharmacist Advice */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">คำแนะนำจากเภสัชกร</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg mb-8">มีข้อสงสัยเกี่ยวกับการใช้ยาหรือผลิตภัณฑ์สุขภาพ? ปรึกษาเภสัชกรของเราได้ตลอด 24 ชั่วโมง</p>
            <Link
              href="/pharmacist-advice"
              className="bg-secondary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-secondary-dark transition duration-300"
            >
              ขอคำปรึกษา
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">เกี่ยวกับเรา</h3>
              <p>KR Pharma - ร้านขายยาออนไลน์ที่คุณไว้วางใจได้</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">ติดต่อเรา</h3>
              <p>Email: contact@krpharma.com</p>
              <p>Tel: 02-123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">ติดตามเรา</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary">
                  Facebook
                </a>
                <a href="#" className="hover:text-primary">
                  Twitter
                </a>
                <a href="#" className="hover:text-primary">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 KR Pharma. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

