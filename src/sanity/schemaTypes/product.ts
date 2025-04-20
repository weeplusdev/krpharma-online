// Sanity schema - product.js
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'สินค้า',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'ชื่อสินค้า',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'mainImage',
      title: 'รูปภาพหลัก',
      type: 'image',
    }),
    defineField({
      name: 'body',
      title: 'รายละเอียด',
      type: 'blockContent',
    }),
    defineField({
      name: 'externalId',
      title: 'รหัสสินค้าในระบบ',
      type: 'string',
      description: 'รหัสที่ใช้เชื่อมโยงกับ Drizzle'
    })
  ]
});