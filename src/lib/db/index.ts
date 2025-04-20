import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import { config } from "dotenv";

// โหลด .env file
config();

// ตั้งค่า Neon สำหรับ Edge functions
neonConfig.fetchConnectionCache = true;

// เพิ่มการตรวจสอบค่า DATABASE_URL เพื่อดีบัก
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not defined in environment variables");
  throw new Error("DATABASE_URL is missing. Please check your .env file.");
}

// สร้างการเชื่อมต่อ SQL
const sql = neon(databaseUrl);

// สร้าง Drizzle client และส่งออก
export const db = drizzle(sql);

/*
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { config } from "dotenv"

config({ path: ".env" })

const sql = neon(process.env.DATABASE_URL!)

// logger 
// const db = drizzle(sql, { logger: true })
const db = drizzle(sql)

export { db }

*/