import { NextResponse } from 'next/server';
import { syncAllProductsFromSanity } from '@/lib/products/sanity-sync';

// API endpoint สำหรับซิงค์ข้อมูลสินค้าทั้งหมดจาก Sanity
export async function POST() {
  try {
    await syncAllProductsFromSanity();
    return NextResponse.json({ success: true, message: 'ซิงค์ข้อมูลสินค้าสำเร็จ' });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการซิงค์ข้อมูลสินค้า:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการซิงค์ข้อมูลสินค้า' },
      { status: 500 }
    );
  }
} 