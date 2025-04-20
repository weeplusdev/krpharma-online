import { db } from "./index"
import { migrate } from "drizzle-orm/neon-http/migrator"
import * as dotenv from 'dotenv';

// โหลดไฟล์ .env.local ก่อน
dotenv.config({ path: '.env.local' });

const main = async () => {
    try {
        console.log('Using DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
        await migrate(db, {
            migrationsFolder: 'src/lib/db/migrations'
        })
        console.log('Migration completed')
    } catch (error) {
        console.error('Error during migration: ', error)
        process.exit(1)
    }
}

main()