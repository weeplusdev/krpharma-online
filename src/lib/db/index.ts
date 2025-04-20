import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from './schema';

// Next.js จะโหลด .env ให้โดยอัตโนมัติ ไม่จำเป็นต้องใช้ dotenv
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
