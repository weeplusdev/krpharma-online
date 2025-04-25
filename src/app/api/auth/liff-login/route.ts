import { NextResponse } from "next/server"
import { sanityClient } from "@/sanity/lib/client"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"
import { encode } from "next-auth/jwt"

export async function POST(request: Request) {
  try {
    const { profile, token } = await request.json()

    if (!profile || !token) {
      return NextResponse.json({ error: "Missing profile or token" }, { status: 400 })
    }

    // ตรวจสอบว่ามีผู้ใช้ในระบบแล้วหรือไม่
    let user = await sanityClient.fetch(`*[_type == "user" && lineProfile.userId == $userId][0]`, { userId: profile.userId })

    // ถ้ายังไม่มีผู้ใช้ ให้สร้างใหม่
    if (!user) {
      user = await sanityClient.create({
        _id: `user.${uuidv4()}`,
        _type: "user",
        name: profile.displayName,
        email: `${profile.userId}@line.user`, // สร้าง email จำลอง
        image: profile.pictureUrl,
        role: "customer",
        status: "active",
        lineProfile: {
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    // สร้าง session token
    const sessionToken = uuidv4()
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 วัน

    // บันทึก session ลงในฐานข้อมูล
    await sanityClient.create({
      _id: `session.${uuidv4()}`,
      _type: "session",
      userId: user._id,
      sessionToken,
      expires: expires.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // สร้าง JWT token
    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      throw new Error("NEXTAUTH_SECRET is not defined")
    }

    // Cookie name ที่ใช้เป็น salt ใน Auth.js v5
    const salt = process.env.NODE_ENV === "production" 
      ? "__Secure-authjs.session-token" 
      : "authjs.session-token"

    const jwtToken = await encode({
      token: {
        name: user.name,
        email: user.email,
        picture: user.image,
        sub: user._id,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(expires.getTime() / 1000),
        jti: sessionToken,
      },
      secret,
      salt
    })

    // ตั้งค่า cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: "next-auth.session-token",
      value: jwtToken,
      expires,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("LIFF login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
