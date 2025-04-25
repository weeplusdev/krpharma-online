import { getRichMenuList } from '@/utils/line-rich-menu'
import { NextResponse } from 'next/server'

// LINE Channel Access Token
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || ''

export async function GET() {
  try {
    // ตรวจสอบว่ามี token หรือไม่
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'ไม่พบ LINE Channel Access Token' }, { status: 400 })
    }

    // ดึงรายการ Rich Menu ทั้งหมด
    const richMenuList = await getRichMenuList(LINE_CHANNEL_ACCESS_TOKEN)
    
    return NextResponse.json({ 
      success: true,
      richMenuList 
    })
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการดึงรายการ Rich Menu:', error)
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการดึงรายการ Rich Menu', 
      message: error.message 
    }, { status: 500 })
  }
}
