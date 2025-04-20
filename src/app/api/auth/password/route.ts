// ไฟล์นี้ไม่ได้ใช้งานแล้ว แต่สร้างไว้เพื่อแก้ปัญหา build error
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(
    { message: 'API endpoint นี้ถูกย้ายไปยัง /api/auth/hash, /api/auth/verify, และ /api/auth/generate แล้ว' },
    { status: 301 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: 'API endpoint นี้ถูกย้ายไปยัง /api/auth/hash, /api/auth/verify, และ /api/auth/generate แล้ว' },
    { status: 301 }
  );
} 