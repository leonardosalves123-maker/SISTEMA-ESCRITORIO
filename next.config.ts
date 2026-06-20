import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Garante que o arquivo do banco SQLite e os engines do Prisma sejam
  // incluídos no pacote das funções serverless na Vercel.
  outputFileTracingIncludes: {
    "/**": ["./prisma/dev.db", "./node_modules/.prisma/client/**"],
  },
};

export default nextConfig;
