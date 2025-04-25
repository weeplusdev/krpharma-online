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
  
  export type SanityProduct = {
    _id: string;
    title: string;
    slug: { current: string };
    mainImage: { asset: { _ref: string } };
    externalId?: string;
    body?: any; // สำหรับ block content
  };
  
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