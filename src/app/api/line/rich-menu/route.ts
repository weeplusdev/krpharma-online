import { createRichMenu, uploadRichMenuImage, setDefaultRichMenu } from '@/utils/line-rich-menu'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// ข้อมูลสำหรับการสร้าง Rich Menu
const createKRPharmaRichMenu = {
  size: {
    width: 2500,
    height: 1686
  },
  selected: true,
  name: "KR Pharma Rich Menu",
  chatBarText: "เมนู",
  areas: [
    {
      bounds: {
        x: 0,
        y: 0,
        width: 833,
        height: 843
      },
      action: {
        type: "uri",
        uri: "https://krpharma.com/shop"
      }
    },
    {
      bounds: {
        x: 834,
        y: 0,
        width: 833,
        height: 843
      },
      action: {
        type: "uri",
        uri: "https://krpharma.com/products"
      }
    },
    {
      bounds: {
        x: 1667,
        y: 0,
        width: 833,
        height: 843
      },
      action: {
        type: "uri",
        uri: "https://krpharma.com/cart"
      }
    },
    {
      bounds: {
        x: 0,
        y: 843,
        width: 833,
        height: 843
      },
      action: {
        type: "uri",
        uri: "https://krpharma.com/account"
      }
    },
    {
      bounds: {
        x: 834,
        y: 843,
        width: 833,
        height: 843
      },
      action: {
        type: "uri",
        uri: "https://krpharma.com/orders"
      }
    },
    {
      bounds: {
        x: 1667,
        y: 843,
        width: 833,
        height: 843
      },
      action: {
        type: "uri",
        uri: "https://krpharma.com/contact"
      }
    }
  ]
}

// LINE Channel Access Token
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || ''

export async function GET() {
  try {
    return NextResponse.json({ message: 'ใช้ POST เพื่อสร้าง Rich Menu' })
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}

export async function POST() {
  try {
    // ตรวจสอบว่ามี token หรือไม่
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'ไม่พบ LINE Channel Access Token' }, { status: 400 })
    }

    // 1. สร้าง Rich Menu
    const richMenuId = await createRichMenu(LINE_CHANNEL_ACCESS_TOKEN, createKRPharmaRichMenu)
    
    // 2. อัปโหลดรูปภาพ Rich Menu
    // หมายเหตุ: ปรับเส้นทางไฟล์ตามโครงสร้างโปรเจค
    const imagePath = path.join(process.cwd(), 'public', 'images', 'rich-menu.jpg')
    const imageBuffer = fs.readFileSync(imagePath)
    
    await uploadRichMenuImage(LINE_CHANNEL_ACCESS_TOKEN, richMenuId, imageBuffer)
    
    // 3. ตั้งค่าเป็น Rich Menu เริ่มต้น
    await setDefaultRichMenu(LINE_CHANNEL_ACCESS_TOKEN, richMenuId)
    
    return NextResponse.json({ 
      success: true,
      message: 'สร้าง Rich Menu สำเร็จแล้ว',
      richMenuId 
    })
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการสร้าง Rich Menu:', error)
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการสร้าง Rich Menu', 
      message: error.message 
    }, { status: 500 })
  }
}
