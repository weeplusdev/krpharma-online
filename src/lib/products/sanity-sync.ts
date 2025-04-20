import { db } from '@/lib/db';
import { products, type NewProduct } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sanityClient } from '@/sanity/lib/client';

// ประเภทข้อมูลสำหรับสินค้าใน Sanity
export type SanityProduct = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: { asset: { _ref: string } };
  externalId?: string;
  body: any; // สำหรับ block content
};

// ฟังก์ชันซิงค์ข้อมูลจาก Sanity ไปยัง Drizzle
export async function syncProductFromSanity(sanityProduct: SanityProduct): Promise<void> {
  try {
    // ตรวจสอบว่ามีสินค้านี้ในฐานข้อมูล Drizzle หรือไม่
    const existingProducts = await db
      .select()
      .from(products)
      .where(eq(products.sanityId, sanityProduct._id))
      .limit(1);

    const existingProduct = existingProducts[0];

    // ข้อมูลสำหรับอัปเดตหรือสร้างใหม่
    const productData: NewProduct = {
      name: sanityProduct.title,
      sanityId: sanityProduct._id,
      slug: sanityProduct.slug.current,
      price: existingProduct?.price || '0.00', // ใช้ราคาเดิมหรือกำหนดเป็น 0 หากเป็นสินค้าใหม่
      stock: existingProduct?.stock || 0, // ใช้สต็อกเดิมหรือกำหนดเป็น 0 หากเป็นสินค้าใหม่
    };

    if (existingProduct) {
      // อัปเดตสินค้าที่มีอยู่แล้ว
      await db
        .update(products)
        .set({
          name: productData.name,
          slug: productData.slug,
          updatedAt: new Date()
        })
        .where(eq(products.id, existingProduct.id));
    } else {
      // สร้างสินค้าใหม่
      await db.insert(products).values(productData);
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการซิงค์ข้อมูลสินค้า:', error);
    throw error;
  }
}

// ฟังก์ชันดึงข้อมูลสินค้าทั้งหมดจาก Sanity และซิงค์กับ Drizzle
export async function syncAllProductsFromSanity(): Promise<void> {
  try {
    // ดึงข้อมูลสินค้าทั้งหมดจาก Sanity
    const sanityProducts = await sanityClient.fetch<SanityProduct[]>(`
      *[_type == "product"] {
        _id,
        title,
        slug,
        mainImage,
        externalId,
        body
      }
    `);

    // ซิงค์ข้อมูลแต่ละรายการ
    for (const product of sanityProducts) {
      await syncProductFromSanity(product);
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการซิงค์ข้อมูลสินค้าทั้งหมด:', error);
    throw error;
  }
} 