// แทนที่ PrismaClient ด้วย Mock Data Client

import { mockDb } from "./mock-db"

// จำลอง PrismaClient ด้วย Mock Data
const prismaClientSingleton = () => {
  return mockDb
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export { prisma }
