import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from './schema';
import * as dotenv from 'dotenv';

// โหลดไฟล์ .env.local เพื่อให้แน่ใจว่ามีการอ่านค่า DATABASE_URL
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
