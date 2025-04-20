// src/app/api/products/[slug]/route.ts
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sanityClient } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';
import { SanityProduct } from '@/types/sanity';

interface ProductResponseData {
  id: number;
  name: string;
  price: string;
  stock: number;
  content: any;
  image: string | null;
}

export async function GET(
  request: Request, 
  { params }: { params: { slug: string } }
): Promise<NextResponse<ProductResponseData | { error: string }>> {
  const { slug } = params;
  
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
}