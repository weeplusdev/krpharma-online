import ProductGrid from '@/components/ProductGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'สินค้าทั้งหมด | KR Pharma',
  description: 'ร้านขายยาออนไลน์ที่มีสินค้าคุณภาพหลากหลายให้คุณเลือกสรร ตั้งแต่ยารักษาโรคไปจนถึงอาหารเสริมและผลิตภัณฑ์เพื่อสุขภาพ',
};

export default function ProductsPage() {
  return (
    <main className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">สินค้าทั้งหมด</h1>
          <p className="text-gray-600">
            เลือกซื้อสินค้าคุณภาพมากมายจาก KR Pharma ที่ผ่านการคัดสรรมาเพื่อสุขภาพที่ดีของคุณและครอบครัว
          </p>
        </div>
        
        <ProductGrid />
      </div>
    </main>
  );
} 