'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';

export default function ProductGrid() {
  const { products, isLoading, isError } = useProducts();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 h-64 animate-pulse bg-gray-100"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          เกิดข้อผิดพลาดในการโหลดรายการสินค้า กรุณาลองใหม่อีกครั้ง
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-gray-50 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">ไม่พบสินค้า</h3>
          <p className="text-gray-500">ขออภัย ขณะนี้ไม่มีสินค้าที่ตรงตามเงื่อนไขการค้นหา</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">สินค้าทั้งหมด</h2>
        <div className="flex space-x-2">
          <button
            className={`p-2 rounded ${view === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('grid')}
          >
            กริด
          </button>
          <button
            className={`p-2 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('list')}
          >
            รายการ
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-48 bg-gray-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">ไม่มีรูปภาพ</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <div className="flex mt-2">
                  {product.categories.map((category, idx) => (
                    <span 
                      key={idx} 
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex">
                <div className="w-32 h-32 bg-gray-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">ไม่มีรูปภาพ</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1">
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <div className="flex mt-2">
                    {product.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 