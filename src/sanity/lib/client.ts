import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImage } from '@/types/sanity';

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production'
};

export const sanityClient = createClient(sanityConfig);

const builder = imageUrlBuilder(sanityConfig);

export function urlForImage(source: SanityImage): string {
  return builder.image(source).auto('format').fit('max').url();
}