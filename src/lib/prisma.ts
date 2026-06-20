import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Na Vercel (serverless) o sistema de arquivos é somente leitura, exceto /tmp.
// Copiamos o banco SQLite empacotado para /tmp para que o Prisma consiga abri-lo.
function resolverDatabaseUrl(): string | undefined {
  if (!process.env.VERCEL) return undefined; // localmente usa o .env normalmente

  const destino = "/tmp/dev.db";
  if (!fs.existsSync(destino)) {
    const origem = path.join(process.cwd(), "prisma", "dev.db");
    if (fs.existsSync(origem)) {
      fs.copyFileSync(origem, destino);
    }
  }
  return `file:${destino}`;
}

function criarPrisma(): PrismaClient {
  const url = resolverDatabaseUrl();
  return new PrismaClient(
    url ? { datasources: { db: { url } } } : undefined,
  );
}

export const prisma = globalForPrisma.prisma ?? criarPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
