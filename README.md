# Kalimera — site vitrine et administration

Site trilingue (FR / EN / ES) du studio Kalimera, avec un back-office complet
pour gérer les services, le portfolio, le journal, les témoignages, les images
et les demandes de contact.

- **Framework** : Next.js 16 (App Router, Turbopack) · React 19 · TypeScript
- **Style** : Tailwind CSS v4, design system maison (`src/styles/globals.css`)
- **Base de données** : PostgreSQL (Railway) via Prisma 7
- **Images** : Cloudinary (envoi direct depuis le navigateur, signé côté serveur)
- **Emails** : Resend (notification interne + accusé de réception au visiteur)
- **Authentification** : Auth.js v5, identifiants en base, session JWT
- **Hébergement** : Vercel

---

## 1. Démarrer en local

```bash
npm install
cp .env.example .env.local      # puis renseigner les valeurs
npm run db:local                # (optionnel) Postgres local jetable
npm run db:migrate              # applique le schéma
npm run db:seed                 # contenu de départ + compte admin
npm run dev
```

Le site est sur `http://localhost:3000/fr`, l'administration sur
`http://localhost:3000/admin`.

Seule `DATABASE_URL` est indispensable. Sans Cloudinary l'envoi d'images est
désactivé ; sans Resend le formulaire enregistre quand même la demande en base.

### Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | build de production (nécessite une base joignable) |
| `npm run typecheck` | vérification TypeScript |
| `npm run lint` | ESLint |
| `npm run db:migrate` | crée et applique une migration (développement) |
| `npm run db:deploy` | applique les migrations existantes (production) |
| `npm run db:seed` | insère le contenu de départ |
| `npm run db:studio` | explorateur de base Prisma |
| `npm run db:local` | lance un Postgres local jetable |

---

## 2. Architecture

```
prisma/
  schema.prisma          Modèles + traductions par langue
  seed.ts                Contenu de départ dans les trois langues
src/
  app/
    (site)/[locale]/     Site public — un layout racine, langue dans l'URL
    (admin)/admin/       Administration — layout racine distinct, hors i18n
    api/                 Auth.js + signature d'envoi Cloudinary
    sitemap.ts robots.ts
  components/
    site/                Composants du site public
    admin/               Composants du back-office
    ui/                  Primitives partagées (bouton, pastille, révélation…)
  i18n/                  Configuration next-intl (langues, chemins traduits)
  lib/                   Prisma, auth, contenu, email, Cloudinary, SEO
  messages/              Textes d'interface : fr.json, en.json, es.json
  styles/globals.css     Tokens du design system
```

### Contenu traduit

Chaque contenu éditorial a une ligne « parent » (ordre, images, techno, dates)
et **une ligne de traduction par langue** qui porte son propre `slug`. C'est ce
qui permet d'avoir :

```
/fr/projets/thalassa-resorts
/en/work/thalassa-resorts
/es/proyectos/thalassa-resorts
```

Une langue laissée vide dans l'administration n'est pas enregistrée : le site
affiche alors la version française, sans page cassée ni contenu vide.

### Mise en cache

Les pages publiques déclarent `export const revalidate = 300` : elles sont
servies depuis le cache et régénérées au plus toutes les cinq minutes. Après
chaque écriture dans l'administration, `revalidateSite()` invalide les trois
langues immédiatement — une publication est donc visible tout de suite.

`cacheComponents` (activé par défaut par `create-next-app`) a été désactivé :
il est incompatible avec `export const revalidate`, et le comportement ISR
classique est plus prévisible ici.

### next-intl sans son plugin

`createNextIntlPlugin()` fait `require('@swc/core')` au chargement de la
configuration, uniquement pour des options expérimentales inutilisées ici. Ce
binaire natif refuse de se charger sur certains postes Windows et bloque alors
tout build. `next.config.ts` déclare donc directement l'alias
`next-intl/config` que le plugin aurait posé — c'est sa seule fonction
indispensable pour notre usage.

---

## 3. Mise en production

### 3.1 Base de données — Railway

1. Créer un projet Railway, puis **New → Database → PostgreSQL**.
2. Onglet **Variables** du service Postgres, copier `DATABASE_URL` (variante
   publique). Ajouter `?sslmode=require` si absent.
3. Appliquer le schéma et le contenu de départ depuis le poste local :

```bash
DATABASE_URL="postgresql://..." npm run db:deploy
DATABASE_URL="postgresql://..." SEED_ADMIN_PASSWORD="<mot de passe fort>" npm run db:seed
```

Le seed crée le compte administrateur. **Changez le mot de passe depuis
`/admin/settings` après la première connexion.**

### 3.2 Images — Cloudinary

Créer un compte, puis relever dans **Settings → API Keys** : `Cloud name`,
`API Key`, `API Secret`. Aucune configuration supplémentaire : les fichiers
sont déposés dans le dossier `kalimera/`.

### 3.3 Emails — Resend

1. Ajouter le domaine `kalimera.agency` dans Resend.
2. Créer les enregistrements DNS demandés (SPF, DKIM) chez o2switch — voir 3.5.
3. Créer une clé API et la renseigner dans `RESEND_API_KEY`.

Tant que le domaine n'est pas vérifié, utiliser `onboarding@resend.dev` comme
expéditeur pour tester.

### 3.4 Déploiement — Vercel

```bash
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL production     # répéter pour chaque variable
vercel --prod
```

Variables à créer dans Vercel (Production **et** Preview) :

| Variable | Valeur |
| --- | --- |
| `DATABASE_URL` | chaîne Railway |
| `NEXT_PUBLIC_SITE_URL` | `https://kalimera.agency` |
| `AUTH_SECRET` | généré par `npx auth secret` |
| `CLOUDINARY_CLOUD_NAME` · `CLOUDINARY_API_KEY` · `CLOUDINARY_API_SECRET` | Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | identique au cloud name |
| `RESEND_API_KEY` | Resend |
| `CONTACT_FROM_EMAIL` | `Kalimera <contact@kalimera.agency>` |
| `CONTACT_TO_EMAIL` | adresse de réception des demandes |

`AUTH_URL` est inutile : Vercel le déduit du domaine.

### 3.5 Domaine et DNS — o2switch

Dans Vercel, **Settings → Domains**, ajouter `kalimera.agency` et
`www.kalimera.agency`. Puis dans le cPanel o2switch, **Zone Editor** du
domaine, créer :

| Type | Nom | Valeur | TTL |
| --- | --- | --- | --- |
| `A` | `@` | `216.198.79.1` | 300 |
| `CNAME` | `www` | `<valeur affichée par Vercel>` | 300 |

Vercel affiche les valeurs exactes à utiliser : **reprendre celles de
l'interface**, elles peuvent différer de cet exemple.

Supprimer les enregistrements `A` et `CNAME` existants qui pointent vers
l'hébergement o2switch, sinon le domaine continuera d'y répondre.

Ajouter dans la même zone les enregistrements fournis par Resend (TXT pour SPF
et DKIM, éventuellement un CNAME de suivi).

La propagation prend de quelques minutes à quelques heures. Vercel émet le
certificat TLS automatiquement une fois le domaine vérifié.

---

## 4. Utiliser l'administration

`/admin` — tableau de bord : volume de contenu, brouillons, alerte sur les
traductions manquantes, dernières demandes.

| Section | Ce qu'on y fait |
| --- | --- |
| **Services** | Les six prestations. Ordre par flèches, publication, contenu Markdown par langue, pastilles techno, icône. |
| **Projets** | Portfolio. Capture d'écran, galerie, chiffres clés trilingues, besoin / solution / résultat, services liés, mise en avant. |
| **Journal** | Articles. Markdown, image de couverture, date de publication (une date future programme la parution). |
| **Témoignages** | Citations. Le premier publié apparaît en page d'accueil. |
| **Médias** | Toutes les images, avec leur texte alternatif par langue. Une image utilisée ne peut pas être supprimée. |
| **Messages** | Demandes du formulaire, à marquer comme lues puis archiver. |
| **Réglages** | Nom, email, mot de passe, et état des services connectés. |

Le français est obligatoire sur chaque contenu ; l'anglais et l'espagnol
peuvent être complétés plus tard.

---

## 5. Points restants

- **Mentions légales et confidentialité** : `src/content/legal.ts` contient des
  emplacements entre crochets (raison sociale, SIREN, adresse, TVA) à remplir
  avant la mise en ligne.
- **Chiffres de la page d'accueil** : `src/lib/site.ts` — 180 projets, 98 de
  Lighthouse, 6 semaines, 12 ans sont des valeurs d'exemple à remplacer par les
  vraies.
- **Coordonnées** : téléphone et liens sociaux également dans `src/lib/site.ts`.
- **Captures d'écran des projets** : les cartes affichent un squelette de page
  tant qu'aucune image n'est envoyée.
- **Limitation du formulaire** : le compteur anti-abus vit en mémoire de
  l'instance. Suffisant pour un site vitrine ; pour une protection stricte il
  faudrait un store partagé (Upstash Redis) ou Vercel BotID.
