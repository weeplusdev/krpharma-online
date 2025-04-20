import { config } from "dotenv";
import * as fs from 'fs';

// โหลด .env file
config();

// เรียกใช้ในโค้ดเพื่อดู DATABASE_URL ที่ได้มา
const databaseUrl = process.env.DATABASE_URL;

// ตรวจสอบว่ามีค่าหรือไม่
if (!databaseUrl) {
  console.error("DATABASE_URL ไม่ได้ถูกกำหนดในตัวแปรสภาพแวดล้อม");
} else {
  // ปิดบังข้อมูลสำคัญ
  const hiddenUrl = databaseUrl.replace(/(postgres|postgresql):\/\/([^:]+):[^@]+@/, "$1://$2:****@");
  console.log("DATABASE_URL (แบบปิดบังรหัสผ่าน):", hiddenUrl);
  
  // ตรวจสอบรูปแบบ URL ว่าถูกต้องหรือไม่
  try {
    const url = new URL(databaseUrl);
    console.log("Protocol:", url.protocol);
    console.log("Host:", url.host);
    console.log("Username:", url.username);
    console.log("Has Password:", url.password.length > 0 ? "Yes" : "No");
    console.log("Pathname (database name):", url.pathname);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("URL ไม่ถูกต้อง:", e.message);
    } else {
      console.error("URL ไม่ถูกต้อง:", String(e));
    }
  }
}

// ตรวจสอบการเข้าถึงไฟล์ .env
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const envLines = envContent.split('\n').length;
  console.log(".env file มี", envLines, "บรรทัด");
} catch (e: unknown) {
  if (e instanceof Error) {
    console.error("ไม่สามารถอ่านไฟล์ .env:", e.message);
  } else {
    console.error("ไม่สามารถอ่านไฟล์ .env:", String(e));
  }
} 