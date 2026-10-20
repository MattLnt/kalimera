import path from "node:path";

import type { NextConfig } from "next";

/**
 * next-intl est habituellement branché via `createNextIntlPlugin()`. Ce plugin
 * fait `require('@swc/core')` au chargement de la configuration, uniquement
 * pour des options expérimentales que nous n'utilisons pas (extraction de
 * messages, précompilation). Sur certains postes Windows ce binaire natif
 * refuse de se charger, ce qui bloque le build avant même qu'il démarre.
 *
 * Le plugin ne fait, pour notre usage, qu'une seule chose indispensable :
 * aliaser `next-intl/config` vers notre fichier de configuration de requête.
 * On le déclare donc directement ici.
 */
const REQUEST_CONFIG = "./src/i18n/request.ts";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // Chaîne Tailwind v4 : sans cette règle, les directives @theme et
      // @layer ne sont pas compilées et aucune classe n'est générée.
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
    resolveAlias: {
      // Turbopack attend un chemin relatif, avec des slashes avant.
      "next-intl/config": REQUEST_CONFIG,
    },
  },
  webpack(config) {
    // Webpack, lui, exige un chemin absolu.
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["next-intl/config"] = path.resolve(
      process.cwd(),
      REQUEST_CONFIG,
    );
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Le client Prisma est généré dans src/generated : il doit rester externe au
  // bundle serveur pour que son moteur se charge correctement.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
