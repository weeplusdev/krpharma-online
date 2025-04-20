import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าอีเมลนี้มีในระบบหรือไม่
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'อีเมลนี้มีในระบบแล้ว กรุณาใช้อีเมลอื่น' },
        { status: 400 }
      );
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await hash(password, 10);

    // สร้างผู้ใช้ใหม่
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: 'customer', // กำหนดบทบาทเริ่มต้นเป็น customer
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json(
      { message: 'ลงทะเบียนสำเร็จ' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
      { status: 500 }
    );
  }
} 