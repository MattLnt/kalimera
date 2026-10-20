import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// La CLI Prisma ne lit pas les fichiers d'environnement de Next : on charge
// .env.local en premier (développement), puis .env en complément. dotenv ne
// remplace jamais une variable déjà définie, donc l'ordre fait la priorité.
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
