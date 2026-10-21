-- CreateEnum
CREATE TYPE "LandingKind" AS ENUM ('SECTOR', 'LOCATION');

-- CreateTable
CREATE TABLE "landings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" "LandingKind" NOT NULL DEFAULT 'SECTOR',
    "icon" TEXT NOT NULL DEFAULT 'Layers',
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landing_translations" (
    "id" TEXT NOT NULL,
    "landingId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "landing_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landing_faqs" (
    "id" TEXT NOT NULL,
    "landingId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "questionFr" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL DEFAULT '',
    "questionEs" TEXT NOT NULL DEFAULT '',
    "answerFr" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL DEFAULT '',
    "answerEs" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "landing_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LandingServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LandingServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LandingProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LandingProjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "landings_key_key" ON "landings"("key");

-- CreateIndex
CREATE INDEX "landings_published_kind_position_idx" ON "landings"("published", "kind", "position");

-- CreateIndex
CREATE UNIQUE INDEX "landing_translations_landingId_locale_key" ON "landing_translations"("landingId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "landing_translations_locale_slug_key" ON "landing_translations"("locale", "slug");

-- CreateIndex
CREATE INDEX "landing_faqs_landingId_position_idx" ON "landing_faqs"("landingId", "position");

-- CreateIndex
CREATE INDEX "_LandingServices_B_index" ON "_LandingServices"("B");

-- CreateIndex
CREATE INDEX "_LandingProjects_B_index" ON "_LandingProjects"("B");

-- AddForeignKey
ALTER TABLE "landing_translations" ADD CONSTRAINT "landing_translations_landingId_fkey" FOREIGN KEY ("landingId") REFERENCES "landings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landing_faqs" ADD CONSTRAINT "landing_faqs_landingId_fkey" FOREIGN KEY ("landingId") REFERENCES "landings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LandingServices" ADD CONSTRAINT "_LandingServices_A_fkey" FOREIGN KEY ("A") REFERENCES "landings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LandingServices" ADD CONSTRAINT "_LandingServices_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LandingProjects" ADD CONSTRAINT "_LandingProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "landings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LandingProjects" ADD CONSTRAINT "_LandingProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

