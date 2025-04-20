import { db } from '@/lib/db';
import { products, type NewProduct } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sanityClient } from '@/sanity/lib/client';
import { SanityProduct } from '@/types/sanity';

export async function syncProducts(): Promise<void> {
  // ดึงข้อมูลจาก Sanity
  const sanityProducts = await sanityClient.fetch<SanityProduct[]>(`
    *[_type == "product"] {
      _id,
      title,
      slug { current },
      mainImage
    }
  `);

  // อัปเดตหรือสร้างข้อมูลใน Drizzle
  for (const product of sanityProducts) {
    // ตรวจสอบว่ามีสินค้านี้ใน Drizzle หรือไม่
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.sanityId, product._id)
    });

    if (existingProduct) {
      // อัปเดตข้อมูล
      await db.update(products)
        .set({ 
          name: product.title,
          slug: product.slug.current,
          updatedAt: new Date()
        })
        .where(eq(products.sanityId, product._id));
    } else {
      // สร้างข้อมูลใหม่
      const newProduct: NewProduct = {
        name: product.title,
        sanityId: product._id,
        slug: product.slug.current,
        price: '0', // ต้องใช้ string ตาม Drizzle decimal type
        stock: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.insert(products).values(newProduct);
    }
  }
}