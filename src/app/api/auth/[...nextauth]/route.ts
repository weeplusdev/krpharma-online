import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import type { Session, DefaultSession } from "next-auth"
import type { User, Account, Profile } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { AdapterUser } from "next-auth/adapters"
import CredentialsProvider from "next-auth/providers/credentials"
import LineProvider from "next-auth/providers/line"
import SanityAdapter from "@/lib/auth/sanity-adapter"
import { client } from "@/sanity/lib/client"
import { comparePwd } from "@/lib/auth/password"

// เพิ่ม properties ให้กับ session.user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"]
  }
}

// ตรวจสอบการเชื่อมต่อกับ Sanity
const checkSanityConnection = async () => {
  try {
    await client.fetch('*[_type == "user"][0]._id')
    return true
  } catch (error) {
    console.error('Error connecting to Sanity:', error)
    return false
  }
}

// เรียกใช้ฟังก์ชันตรวจสอบเมื่อเริ่มต้น
checkSanityConnection().then((isConnected) => {
  if (!isConnected) {
    console.error('Failed to connect to Sanity - check your project ID and dataset')
  } else {
    console.log('Successfully connected to Sanity')
  }
})

// สร้าง adapter
const adapter = SanityAdapter(client)

// กำหนดค่า NextAuth
const authConfig = {
  session: { strategy: "jwt" as const },
  adapter: adapter,
  pages: { signIn: '/auth/sign-in' },
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.sub as string;
      return session
    }
  },
  providers: [
    CredentialsProvider({
      name: "Email/Password",
      credentials: {
        email: { label: "อีเมล", type: "email" },
        password: { label: "รหัสผ่าน", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const password = credentials.password as string;
          
          // ค้นหาผู้ใช้จาก Sanity
          const user = await client.fetch(
            `*[_type == "user" && email == $email][0]{
              _id,
              name,
              email,
              emailVerified,
              image,
              passwordHash,
              role,
              status
            }`,
            { email: credentials.email },
          )

          if (!user || !user.passwordHash) {
            return null
          }

          // ตรวจสอบรหัสผ่าน
          const passwordHash = user.passwordHash as string;
          const isValid = await comparePwd(password, passwordHash);

          if (!isValid) {
            return null
          }

          // ตรวจสอบสถานะผู้ใช้
          if (user.status !== "active") {
            throw new Error("บัญชีถูกระงับหรือรอการยืนยัน")
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error('Error during authentication:', error)
          return null
        }
      },
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
    }),
  ],
  debug: process.env.NODE_ENV === "development",
}

// แก้ไขการเรียกใช้ NextAuth เพื่อใช้ handlers ของ NextAuth v5
export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authConfig);