import * as dotenv from 'dotenv';
import fs from 'fs';

// โหลดไฟล์ .env.local ก่อน
dotenv.config({ path: '.env.local' });

// ฟังก์ชันตรวจสอบ DATABASE_URL
function checkDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  console.log('===== Database Connection Debug =====');
  
  if (!databaseUrl) {
    console.error("DATABASE_URL ไม่ได้ถูกกำหนดในตัวแปรสภาพแวดล้อม");
    return;
  }
  
  console.log("DATABASE_URL มีค่าอยู่:", databaseUrl.slice(0, 12) + '...');
  
  // ตรวจสอบว่า URL เป็นรูปแบบที่ถูกต้องหรือไม่
  try {
    const url = new URL(databaseUrl);
    console.log("URL มีรูปแบบถูกต้อง");
    console.log("Protocol:", url.protocol);
    console.log("Host:", url.host);
    console.log("Path:", url.pathname);
  } catch (e) {
    if (e instanceof Error) {
      console.error("URL ไม่ถูกต้อง:", e.message);
    } else {
      console.error("URL ไม่ถูกต้อง:", String(e));
    }
  }
  
  // ตรวจสอบไฟล์ .env.local
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    console.log("\n.env.local file content:");
    
    // แสดงเฉพาะบรรทัดที่มี DATABASE_URL แต่ปิดบังส่วนที่เป็นข้อมูลสำคัญ
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('DATABASE_URL')) {
        const parts = line.split('=');
        if (parts.length >= 2) {
          console.log(`${parts[0]}=${parts[1].slice(0, 12)}...`);
        } else {
          console.log(line);
        }
      } else if (line.trim()) {
        console.log(`${line.split('=')[0]}=***`);
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error("ไม่สามารถอ่านไฟล์ .env:", e.message);
    } else {
      console.error("ไม่สามารถอ่านไฟล์ .env:", String(e));
    }
  }
}

// รันฟังก์ชันตรวจสอบ
checkDatabaseUrl(); 