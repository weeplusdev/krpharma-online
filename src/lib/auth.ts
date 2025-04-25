// ไฟล์นี้ไม่จำเป็นต้องใช้แล้ว เนื่องจากเราย้ายการตั้งค่าทั้งหมดไปที่ route.ts
// แต่เราจะเก็บไว้เพื่อความเข้ากันได้กับโค้ดอื่นๆ
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import { users } from "@/lib/mock-db"

// ระบุประเภทสำหรับ Auth Options
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // ค้นหาผู้ใช้จากข้อมูลจำลอง
        const user = users.find((user) => user.email === credentials.email)

        if (!user) {
          return null
        }

        // ตรวจสอบรหัสผ่านแบบง่าย
        const isPasswordValid = credentials.password === user.password

        if (!isPasswordValid) {
          return null
        }

        // ส่งคืนข้อมูลผู้ใช้ที่จำเป็น
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 วัน
  },
  pages: {
    signIn: "/web/auth/signin",
    error: "/web/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: any, token: JWT }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  secret: "your-secret-key-here", // ใช้ค่าคงที่เพื่อการทดสอบ
  debug: true, // เปิด debug mode เพื่อดูข้อผิดพลาดที่เกิดขึ้น
}
