import { NextRequest, NextResponse } from 'next/server';
import { syncProducts } from '@/lib/sync/sync-products';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // ตรวจสอบว่ามีการกำหนด webhook secret หรือไม่
    const webhookSecret = process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET || process.env.SANITY_WEBHOOK_SECRET;
    
    // ถ้ามีการกำหนด webhook secret ให้ตรวจสอบ
    if (webhookSecret && body.secret !== webhookSecret) {
      console.log('Webhook unauthorized: Invalid secret');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // ถ้าไม่มีการกำหนด webhook secret หรือตรวจสอบผ่านแล้ว ให้ดำเนินการต่อ
    console.log('Webhook received, syncing products...');
    await syncProducts();
    console.log('Products synced successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
