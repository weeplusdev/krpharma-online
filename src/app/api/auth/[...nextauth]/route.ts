import { handlers } from "@/auth"

// จัดการ request ของ NextAuth
export const { GET, POST } = handlers

// รันบน Node.js runtime เพื่อให้ใช้งานได้กับ dotenv และโมดูลอื่นๆ ของ Node.js
export const runtime = "nodejs" 
