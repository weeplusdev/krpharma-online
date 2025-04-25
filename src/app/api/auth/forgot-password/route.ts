import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
//import { users } from '@/lib/db/schema';
import crypto from 'crypto';

// ในสภาพแวดล้อมจริง ควรเพิ่มการส่งอีเมลจริงๆ
// แต่ในตัวอย่างนี้เราจะจำลองการส่งอีเมลโดยการแสดงลอก

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // ตรวจสอบว่าอีเมลมีในระบบหรือไม่
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      // เพื่อความปลอดภัย เราจะส่งข้อความเหมือนกันไม่ว่าอีเมลจะมีในระบบหรือไม่
      // เพื่อป้องกันการรั่วไหลของข้อมูลว่าอีเมลนี้มีในระบบหรือไม่
      return NextResponse.json(
        { message: 'ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบอีเมลของคุณ' },
        { status: 200 }
      );
    }

    // สร้างโทเค็นสำหรับรีเซ็ตรหัสผ่าน
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // หมดอายุใน 1 ชั่วโมง

    // ในสภาพแวดล้อมจริง ควรบันทึกโทเค็นและวันที่หมดอายุไว้ในฐานข้อมูล
    // และควรเข้ารหัสโทเค็นด้วย
    
    console.log(`รีเซ็ตรหัสผ่านสำหรับ ${email}`);
    console.log(`โทเค็น: ${resetToken}`);
    console.log(`URL รีเซ็ตรหัสผ่าน: ${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}&email=${email}`);

    // ส่งอีเมลที่มีลิงก์รีเซ็ตรหัสผ่าน
    // ในสภาพแวดล้อมจริง ควรใช้บริการส่งอีเมลเช่น SendGrid, Mailgun, หรือ AWS SES

    return NextResponse.json(
      { message: 'ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบอีเมลของคุณ' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' },
      { status: 500 }
    );
  }
} 