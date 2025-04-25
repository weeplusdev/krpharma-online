import type { DefaultSession } from "next-auth"
import { Session } from "next-auth"

declare module "next-auth" {
  /**
   * เพิ่ม property ให้กับ User ใน session
   */
  interface Session {
    provider?: string;
    accessToken?: string;
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    name?: string | null
    email?: string | null
  }
}

declare module "next-auth/jwt" {
  /** 
   * เพิ่ม property ให้กับ JWT token ใน next-auth 
   */
  interface JWT {
    id: string
    role: string
  }
}

