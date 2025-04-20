import { handlers } from "@/auth"

// จัดการ request ของ NextAuth
export const { GET, POST } = handlers

// รันบน Edge runtime เพื่อประสิทธิภาพที่ดีขึ้น
export const runtime = "edge" 
