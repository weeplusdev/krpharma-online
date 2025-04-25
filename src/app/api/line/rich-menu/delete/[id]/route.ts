import { deleteRichMenu } from '@/utils/line-rich-menu'
import { NextResponse } from 'next/server'

// LINE Channel Access Token
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || ''

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ตรวจสอบว่ามี token หรือไม่
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'ไม่พบ LINE Channel Access Token' }, { status: 400 })
    }

    const richMenuId = params.id

    if (!richMenuId) {
      return NextResponse.json({ error: 'ไม่พบ Rich Menu ID' }, { status: 400 })
    }

    // ลบ Rich Menu
    await deleteRichMenu(LINE_CHANNEL_ACCESS_TOKEN, richMenuId)
    
    return NextResponse.json({ 
      success: true,
      message: `ลบ Rich Menu ID: ${richMenuId} สำเร็จแล้ว` 
    })
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการลบ Rich Menu:', error)
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการลบ Rich Menu', 
      message: error.message 
    }, { status: 500 })
  }
}
