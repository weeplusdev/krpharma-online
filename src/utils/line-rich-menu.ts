/**
 * ยูทิลิตี้สำหรับการจัดการ Rich Menu ใน LINE
 */

import axios from 'axios'

// ตั้งค่า Line API
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot'
const LINE_RICH_MENU_API = `${LINE_MESSAGING_API}/richmenu`

/**
 * สร้าง Rich Menu สำหรับ LINE
 * @param channelAccessToken - Channel Access Token จาก LINE Developer Console
 * @param richMenuObject - ข้อมูล Rich Menu ที่ต้องการสร้าง
 * @returns Rich Menu ID หากสร้างสำเร็จ
 */
export async function createRichMenu(channelAccessToken: string, richMenuObject: any): Promise<string> {
  try {
    const response = await axios.post(LINE_RICH_MENU_API, richMenuObject, {
      headers: {
        'Authorization': `Bearer ${channelAccessToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response.data.richMenuId
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้าง Rich Menu:', error)
    throw error
  }
}

/**
 * อัปโหลดรูปภาพสำหรับ Rich Menu
 * @param channelAccessToken - Channel Access Token
 * @param richMenuId - ID ของ Rich Menu ที่ต้องการอัปโหลดรูปภาพ
 * @param imagePath - path ของรูปภาพที่ต้องการอัปโหลด (เป็น Buffer หรือ Base64)
 */
export async function uploadRichMenuImage(
  channelAccessToken: string, 
  richMenuId: string, 
  imageBuffer: Buffer
): Promise<void> {
  try {
    await axios.post(
      `${LINE_RICH_MENU_API}/${richMenuId}/content`,
      imageBuffer,
      {
        headers: {
          'Authorization': `Bearer ${channelAccessToken}`,
          'Content-Type': 'image/jpeg'
        }
      }
    )
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ Rich Menu:', error)
    throw error
  }
}

/**
 * ตั้งค่า Rich Menu เป็นค่าเริ่มต้นสำหรับผู้ใช้ทุกคน
 * @param channelAccessToken - Channel Access Token
 * @param richMenuId - ID ของ Rich Menu ที่ต้องการตั้งเป็นค่าเริ่มต้น
 */
export async function setDefaultRichMenu(channelAccessToken: string, richMenuId: string): Promise<void> {
  try {
    await axios.post(
      `${LINE_MESSAGING_API}/user/all/richmenu/${richMenuId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${channelAccessToken}`
        }
      }
    )
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตั้งค่า Rich Menu เริ่มต้น:', error)
    throw error
  }
}

/**
 * ลบ Rich Menu
 * @param channelAccessToken - Channel Access Token
 * @param richMenuId - ID ของ Rich Menu ที่ต้องการลบ
 */
export async function deleteRichMenu(channelAccessToken: string, richMenuId: string): Promise<void> {
  try {
    await axios.delete(
      `${LINE_RICH_MENU_API}/${richMenuId}`,
      {
        headers: {
          'Authorization': `Bearer ${channelAccessToken}`
        }
      }
    )
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบ Rich Menu:', error)
    throw error
  }
}

/**
 * ดึงรายการ Rich Menu ทั้งหมด
 * @param channelAccessToken - Channel Access Token
 * @returns รายการของ Rich Menu ทั้งหมด
 */
export async function getRichMenuList(channelAccessToken: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `${LINE_RICH_MENU_API}/list`,
      {
        headers: {
          'Authorization': `Bearer ${channelAccessToken}`
        }
      }
    )
    
    return response.data.richmenus || []
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงรา��การ Rich Menu:', error)
    throw error
  }
}
