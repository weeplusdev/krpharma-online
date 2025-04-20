import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import { Metadata, ResolvingMetadata } from 'next';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  
  // ดึงข้อมูลสินค้าจาก Sanity
  const sanityProduct = await client.fetch(`
    *[_type == "product" && slug.current == $slug][0] {
      title,
      "description": array::join(string::split(pt::text(body), "")[0...200], "") + "..."
    }
  `, { slug });
  
  if (!sanityProduct) {
    return {
      title: 'ไม่พบสินค้า | KR Pharma',
      description: 'ไม่พบสินค้าที่คุณกำลังค้นหา',
    };
  }
  
  return {
    title: `${sanityProduct.title} | KR Pharma`,
    description: sanityProduct.description || 'รายละเอียดสินค้าจาก KR Pharma',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const slug = params.slug;
  
  // ดึงข้อมูลสินค้าจาก Sanity
  const sanityProduct = await client.fetch(`
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      mainImage,
      body,
      externalId
    }
  `, { slug });
  
  if (!sanityProduct) {
    notFound();
  }
  
  // ดึงข้อมูลราคาและสต็อกจาก Drizzle
  const productData = await db.query.products.findFirst({
    where: sanityProduct.externalId 
      ? eq(products.sanityId, sanityProduct.externalId) 
      : eq(products.slug, slug)
  });
  
  if (!productData) {
    notFound();
  }
  
  // รวมข้อมูลจาก Sanity และ Drizzle
  const combinedProduct = {
    id: productData.id,
    name: sanityProduct.title,
    price: productData.price.toString(),
    stock: productData.stock,
    content: sanityProduct.body || [],
    image: sanityProduct.mainImage ? urlFor(sanityProduct.mainImage).url() : null,
  };
  
  return (
    <main className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <ProductDetail product={combinedProduct} />
      </div>
    </main>
  );
} 