import { type Config, defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

// ตรวจสอบว่ามีการกำหนด DATABASE_URL หรือไม่
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});