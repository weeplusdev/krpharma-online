// src/types/sanity.ts
export interface SanityImage {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    crop?: {
      _type: 'sanity.imageCrop';
      bottom: number;
      left: number;
      right: number;
      top: number;
    };
    hotspot?: {
      _type: 'sanity.imageHotspot';
      height: number;
      width: number;
      x: number;
      y: number;
    };
  }
  
  export interface SanitySlug {
    _type: 'slug';
    current: string;
  }
  
  export interface SanityProduct {
    _id: string;
    _type: 'product';
    title: string;
    slug: SanitySlug;
    mainImage?: SanityImage;
    body?: any[]; // PortableText content
    externalId?: string;
  }
  
  export interface SanityCategory {
    _id: string;
    _type: 'category';
    title: string;
    slug: SanitySlug;
    description?: string;
  }
  
  export interface SanityBlockContent {
    _type: 'block';
    children: {
      _key: string;
      _type: 'span';
      marks: string[];
      text: string;
    }[];
    markDefs: any[];
    style: string;
  }