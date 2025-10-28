import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("[INFO] Connected to MySQL via Prisma");
  } catch (error) {
    console.error("[ERROR] Failed to connect to MySQL:", error);
    process.exit(1);
  }
};

export { prisma };
