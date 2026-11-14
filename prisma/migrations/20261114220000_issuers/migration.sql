-- CreateEnum
CREATE TYPE "QuoteAcceptance" AS ENUM ('SIGNATURE', 'VERBAL', 'EMAIL', 'PURCHASE_ORDER', 'OTHER');

-- DropIndex
DROP INDEX "crm_invoices_number_key";

-- DropIndex
DROP INDEX "crm_quotes_number_key";

-- AlterTable
ALTER TABLE "crm_clients" ADD COLUMN     "defaultIssuerId" TEXT,
ADD COLUMN     "printAddress" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "crm_invoices" ADD COLUMN     "contextLine" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "issuerId" TEXT;

-- AlterTable
ALTER TABLE "crm_quotes" ADD COLUMN     "acceptanceNote" TEXT,
ADD COLUMN     "acceptedVia" "QuoteAcceptance",
ADD COLUMN     "context" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "delay" TEXT,
ADD COLUMN     "evolutions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "issuerId" TEXT,
ADD COLUMN     "outOfScope" TEXT,
ADD COLUMN     "paymentNote" TEXT,
ADD COLUMN     "perimeter" TEXT,
ADD COLUMN     "requireSignature" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stack" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "validityDays" INTEGER NOT NULL DEFAULT 30,
ALTER COLUMN "depositPercent" SET DEFAULT 50;

-- CreateTable
CREATE TABLE "crm_issuers" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headerLines" TEXT NOT NULL DEFAULT '',
    "footer" TEXT NOT NULL DEFAULT '',
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "vatMention" TEXT,
    "paymentTerms" TEXT,
    "latePenalty" TEXT,
    "recoveryFee" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "bankHolder" TEXT,
    "bankName" TEXT,
    "iban" TEXT,
    "bic" TEXT,
    "depositPercent" INTEGER NOT NULL DEFAULT 50,
    "quoteValidityDays" INTEGER NOT NULL DEFAULT 30,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'FAC',
    "quotePrefix" TEXT NOT NULL DEFAULT 'DEV',
    "position" INTEGER NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_issuers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "crm_invoices_issuerId_number_key" ON "crm_invoices"("issuerId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "crm_quotes_issuerId_number_key" ON "crm_quotes"("issuerId", "number");

-- AddForeignKey
ALTER TABLE "crm_clients" ADD CONSTRAINT "crm_clients_defaultIssuerId_fkey" FOREIGN KEY ("defaultIssuerId") REFERENCES "crm_issuers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_quotes" ADD CONSTRAINT "crm_quotes_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "crm_issuers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_invoices" ADD CONSTRAINT "crm_invoices_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "crm_issuers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

