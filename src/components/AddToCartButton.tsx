'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  productId: number;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = async () => {
    try {
      setIsLoading(true);
      
      // TODO: ใส่โค้ดการเพิ่มสินค้าลงตะกร้าที่นี่
      // ตัวอย่าง API call:
      // await fetch('/api/cart', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ productId, quantity: 1 })
      // });
      
      // จำลองการทำงาน
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("เพิ่มลงตะกร้าแล้ว", {
        description: "เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว",
      });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={addToCart}
      disabled={isLoading}
      className="w-full md:w-auto"
    >
      {isLoading ? 'กำลังดำเนินการ...' : 'เพิ่มลงตะกร้า'}
    </Button>
  );
} 