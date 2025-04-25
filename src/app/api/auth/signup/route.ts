import { NextResponse } from "next/server"
import { sanityClient } from "@/sanity/lib/client"
import { hashPwd } from "@/lib/auth/password"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (!name || !email || !password) {
      return NextResponse.json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
    }

    // ตรวจสอบว่าอีเมลนี้มีในระบบแล้วหรือไม่
    const existingUser = await sanityClient.fetch(`*[_type == "user" && email == $email][0]`, { email })

    if (existingUser) {
      return NextResponse.json({ message: "อีเมลนี้มีในระบบแล้ว กรุณาใช้อีเมลอื่น" }, { status: 400 })
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await hashPwd(password)

    // สร้างผู้ใช้ใหม่
    const newUser = await sanityClient.create({
      _id: `user.${uuidv4()}`,
      _type: "user",
      name,
      email,
      passwordHash: hashedPassword,
      role: "customer",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ", userId: newUser._id }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง" }, { status: 500 })
  }
}
