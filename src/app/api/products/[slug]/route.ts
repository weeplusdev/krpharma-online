// src/app/api/products/[slug]/route.ts
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sanityClient, urlForImage } from '@/sanity/lib/client';
import { NextRequest, NextResponse } from 'next/server';
import { SanityProduct } from '@/types/sanity';

interface ProductResponseData {
  id: number;
  name: string;
  price: string;
  stock: number;
  content: any;
  image: string | null;
}

// Route handler ตามรูปแบบใหม่ของ Next.js 15
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // ดึงข้อมูลจาก Drizzle
    const productData = await db.query.products.findFirst({
      where: eq(products.slug, slug)
    });
    
    if (!productData) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // ดึงข้อมูลจาก Sanity
    const sanityData = await sanityClient.fetch<SanityProduct | null>(`
      *[_type == "product" && slug.current == $slug][0] {
        title,
        body,
        mainImage
      }
    `, { slug });
    
    if (!sanityData) {
      return NextResponse.json({ error: 'Sanity product not found' }, { status: 404 });
    }
    
    // รวมข้อมูล
    const responseData: ProductResponseData = {
      id: productData.id,
      name: productData.name,
      price: productData.price.toString(),
      stock: productData.stock,
      content: sanityData.body,
      image: sanityData.mainImage ? urlForImage(sanityData.mainImage) : null
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}