import { db } from '@/lib/db';
import { orders, orderItems, products, type NewOrder, type NewOrderItem } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

interface OrderItem {
  productId: number;
  quantity: number;
}

interface CreateOrderRequest {
  items: OrderItem[];
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { items }: CreateOrderRequest = await request.json();
  
  try {
    // ตรวจสอบสต็อกสินค้า
    for (const item of items) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId)
      });
      
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `สินค้า ${product?.name || 'ไม่พบ'} มีไม่เพียงพอ` 
        }, { status: 400 });
      }
    }
    
    // ทำ Transaction
    const result = await db.transaction(async (tx) => {
      // สร้าง Order
      const newOrder: NewOrder = {
        userId: Number(session.user!.id),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const [order] = await tx.insert(orders).values(newOrder).returning();
      
      // สร้าง OrderItems และอัปเดตสต็อก
      const orderItemsToInsert: NewOrderItem[] = [];
      
      for (const item of items) {
        const product = await tx.query.products.findFirst({
          where: eq(products.id, item.productId)
        });
        
        if (!product) continue;
        
        // เพิ่มรายการสินค้า
        orderItemsToInsert.push({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: product.price
        });
        
        // อัปเดตสต็อก
        await tx.update(products)
          .set({ stock: product.stock - item.quantity })
          .where(eq(products.id, item.productId));
      }
      
      // เพิ่ม OrderItems
      if (orderItemsToInsert.length > 0) {
        await tx.insert(orderItems).values(orderItemsToInsert);
      }
      
      return order;
    });
    
    return NextResponse.json({ orderId: result.id }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}