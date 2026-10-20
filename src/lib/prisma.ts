import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL est manquant. Copiez .env.example vers .env.local et renseignez la base Railway.",
  );
}

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
      /**
       * Chaque instance de fonction serverless ouvre son propre pool : un
       * pool large multiplié par le nombre d'instances saturerait vite la
       * base. On garde donc peu de connexions, et on les recycle rapidement
       * pour ne jamais réutiliser une connexion que le serveur a fermée de
       * son côté (cause classique de « Connection terminated unexpectedly »).
       */
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000,
      // Autorise le processus à se terminer sans attendre les connexions inactives.
      allowExitOnIdle: true,
    }),
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

// En développement, Next recharge les modules à chaque édition : sans ce cache
// global on ouvrirait un nouveau pool de connexions à chaque rechargement.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
