import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined
}

const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb; // next.js version 13 hot reloading will trigger multiple instances 

export default prismadb;