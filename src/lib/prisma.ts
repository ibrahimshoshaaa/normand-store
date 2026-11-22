// Normand — Prisma client singleton.
// Returns null when DATABASE_URL is not configured, so the store runs in
// demo mode (static catalog + generated demo orders) without a database.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
