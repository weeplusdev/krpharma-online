// src/lib/hooks/useProducts.ts
import useSWR from 'swr';
import { sanityClient } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { SanityProduct } from '@/types/sanity';

interface ProductPreview {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  categories: string[];
}

type FetcherParams = [string, Record<string, any>];

const fetcher = async ([query, params]: FetcherParams): Promise<ProductPreview[]> => {
  const products = await sanityClient.fetch<SanityProduct[]>(query, params);
  
  return products.map(product => ({
    id: product._id,
    title: product.title,
    slug: product.slug.current,
    imageUrl: product.mainImage ? urlFor(product.mainImage).url() : null,
    categories: [] // จะต้องเพิ่มการดึงหมวดหมู่ถ้าต้องการ
  }));
};

export function useProducts(category?: string) {
  const query = `
    *[_type == "product" ${category ? '&& $category in categories[]->slug.current' : ''}] {
      _id,
      title,
      slug,
      mainImage
    }
  `;

  const { data, error, isLoading } = useSWR<ProductPreview[], Error>(
    [query, { category }],
    fetcher
  );

  return {
    products: data || [],
    isLoading,
    isError: error
  };
}