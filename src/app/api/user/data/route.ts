import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await db.query.users.findFirst({
            where: eq(users.id, parseInt(userId))
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User Not Found" }, { status: 404 });
        }

        // ลบข้อมูลที่ละเอียดอ่อนก่อนส่งกลับ
        const { password, ...safeUserData } = user;

        return NextResponse.json({ success: true, user: safeUserData });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: "ไม่ได้รับอนุญาต" }, { status: 401 });
        }

        const userId = parseInt(session.user.id);
        const data = await request.json();
        
        // ตรวจสอบข้อมูลที่ส่งมา
        const allowedFields = ['name', 'email', 'image'];
        const updateData: Record<string, any> = {};
        
        // กรองเฉพาะฟิลด์ที่อนุญาตให้อัปเดต
        Object.keys(data).forEach(key => {
            if (allowedFields.includes(key)) {
                updateData[key] = data[key];
            }
        });
        
        // เพิ่มเวลาอัปเดต
        updateData.updatedAt = new Date();
        
        // อัปเดตข้อมูลในฐานข้อมูล
        const [updatedUser] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId))
            .returning();
            
        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "ไม่พบผู้ใช้" }, { status: 404 });
        }
        
        // ลบข้อมูลที่ละเอียดอ่อนก่อนส่งกลับ
        const { password, ...safeUserData } = updatedUser;
        
        return NextResponse.json({ 
            success: true, 
            message: "อัปเดตข้อมูลสำเร็จ", 
            user: safeUserData 
        });
        
    } catch (error: any) {
        console.error("อัปเดตข้อมูลผู้ใช้ล้มเหลว:", error);
        return NextResponse.json({ 
            success: false, 
            message: `เกิดข้อผิดพลาด: ${error.message}` 
        }, { status: 500 });
    }
}
