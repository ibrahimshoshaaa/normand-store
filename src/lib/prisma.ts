// Normand — Prisma client singleton.
// Returns null when DATABASE_URL is not configured, so the store runs in
// demo mode (static catalog + generated demo orders) without a database.
//
// Neon free-tier databases suspend after inactivity and can be slow to wake:
// the connection string gets explicit connect/pool timeouts so a first
// query waits for the wake-up instead of failing at once.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function withTimeouts(raw: string): string {
  try {
    const url = new URL(raw);
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "15");
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "30");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      datasources: { db: { url: withTimeouts(process.env.DATABASE_URL) } },
    });
  }
  return globalForPrisma.prisma;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
