-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('LEAD', 'PROSPECT', 'ACTIVE', 'PAST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DealStage" AS ENUM ('LEAD', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON', 'IN_PROGRESS', 'REVIEW', 'DELIVERED', 'MAINTENANCE', 'LOST');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'DOING', 'DONE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "NoteKind" AS ENUM ('CALL', 'MEETING', 'EMAIL', 'NOTE');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'SIGNED', 'DECLINED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LineKind" AS ENUM ('ITEM', 'SECTION');

-- CreateEnum
CREATE TYPE "InvoiceKind" AS ENUM ('DEPOSIT', 'BALANCE', 'STANDARD', 'CREDIT_NOTE');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "clientId" TEXT;

-- AlterTable
ALTER TABLE "contact_messages" ADD COLUMN     "clientId" TEXT;

-- CreateTable
CREATE TABLE "crm_clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "siren" TEXT,
    "vatNumber" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'FR',
    "source" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'LEAD',
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_client_contacts" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "role" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_client_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_deals" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "stage" "DealStage" NOT NULL DEFAULT 'LEAD',
    "amountCents" INTEGER,
    "probability" INTEGER,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "lostReason" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_milestones" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "doneAt" TIMESTAMP(3),
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "TaskPriority" NOT NULL DEFAULT 'NORMAL',
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "clientId" TEXT,
    "dealId" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_notes" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "dealId" TEXT,
    "bookingId" TEXT,
    "kind" "NoteKind" NOT NULL DEFAULT 'NOTE',
    "title" TEXT,
    "body" TEXT NOT NULL DEFAULT '',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMin" INTEGER,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_quotes" (
    "id" TEXT NOT NULL,
    "number" TEXT,
    "clientId" TEXT NOT NULL,
    "dealId" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "intro" TEXT,
    "terms" TEXT,
    "issueDate" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "depositPercent" INTEGER NOT NULL DEFAULT 30,
    "subtotalCents" INTEGER NOT NULL DEFAULT 0,
    "vatCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "token" TEXT NOT NULL,
    "clientSnapshot" JSONB,
    "issuerSnapshot" JSONB,
    "sentAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "signerName" TEXT,
    "signerEmail" TEXT,
    "signerIp" TEXT,
    "signerAgent" TEXT,
    "signatureImage" TEXT,
    "signedHash" TEXT,
    "declinedAt" TIMESTAMP(3),
    "declineReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_quote_lines" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "kind" "LineKind" NOT NULL DEFAULT 'ITEM',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unit" TEXT,
    "unitPriceCents" INTEGER NOT NULL DEFAULT 0,
    "vatRate" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "crm_quote_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_invoices" (
    "id" TEXT NOT NULL,
    "number" TEXT,
    "kind" "InvoiceKind" NOT NULL DEFAULT 'STANDARD',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "clientId" TEXT NOT NULL,
    "dealId" TEXT,
    "quoteId" TEXT,
    "creditedInvoiceId" TEXT,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "issueDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "subtotalCents" INTEGER NOT NULL DEFAULT 0,
    "vatCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "token" TEXT NOT NULL,
    "clientSnapshot" JSONB,
    "issuerSnapshot" JSONB,
    "sentAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_invoice_lines" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "kind" "LineKind" NOT NULL DEFAULT 'ITEM',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unit" TEXT,
    "unitPriceCents" INTEGER NOT NULL DEFAULT 0,
    "vatRate" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "crm_invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'TRANSFER',
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_activities" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "clientId" TEXT,
    "dealId" TEXT,
    "quoteId" TEXT,
    "invoiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_document_counters" (
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "crm_document_counters_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "crm_company_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "tradeName" TEXT NOT NULL DEFAULT 'Kalimera',
    "legalName" TEXT,
    "legalForm" TEXT,
    "siren" TEXT,
    "siret" TEXT,
    "vatNumber" TEXT,
    "vatExempt" BOOLEAN NOT NULL DEFAULT false,
    "defaultVatRate" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'FR',
    "email" TEXT,
    "phone" TEXT,
    "iban" TEXT,
    "bic" TEXT,
    "bankName" TEXT,
    "paymentTermsDays" INTEGER NOT NULL DEFAULT 30,
    "quoteValidityDays" INTEGER NOT NULL DEFAULT 30,
    "defaultDepositPercent" INTEGER NOT NULL DEFAULT 30,
    "quoteTerms" TEXT,
    "invoiceFooter" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_booking_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "stepMinutes" INTEGER NOT NULL DEFAULT 30,
    "bufferMinutes" INTEGER NOT NULL DEFAULT 0,
    "minNoticeHours" INTEGER NOT NULL DEFAULT 12,
    "horizonDays" INTEGER NOT NULL DEFAULT 21,
    "maxPerDay" INTEGER NOT NULL DEFAULT 4,
    "weekly" JSONB NOT NULL,
    "blackoutDates" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "busyCalendarUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_booking_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "crm_clients_status_updatedAt_idx" ON "crm_clients"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "crm_client_contacts_clientId_idx" ON "crm_client_contacts"("clientId");

-- CreateIndex
CREATE INDEX "crm_deals_stage_position_idx" ON "crm_deals"("stage", "position");

-- CreateIndex
CREATE INDEX "crm_deals_clientId_idx" ON "crm_deals"("clientId");

-- CreateIndex
CREATE INDEX "crm_milestones_dealId_position_idx" ON "crm_milestones"("dealId", "position");

-- CreateIndex
CREATE INDEX "crm_tasks_status_dueAt_idx" ON "crm_tasks"("status", "dueAt");

-- CreateIndex
CREATE INDEX "crm_notes_clientId_occurredAt_idx" ON "crm_notes"("clientId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "crm_quotes_number_key" ON "crm_quotes"("number");

-- CreateIndex
CREATE UNIQUE INDEX "crm_quotes_token_key" ON "crm_quotes"("token");

-- CreateIndex
CREATE INDEX "crm_quotes_status_updatedAt_idx" ON "crm_quotes"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "crm_quotes_clientId_idx" ON "crm_quotes"("clientId");

-- CreateIndex
CREATE INDEX "crm_quote_lines_quoteId_position_idx" ON "crm_quote_lines"("quoteId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "crm_invoices_number_key" ON "crm_invoices"("number");

-- CreateIndex
CREATE UNIQUE INDEX "crm_invoices_token_key" ON "crm_invoices"("token");

-- CreateIndex
CREATE INDEX "crm_invoices_status_dueDate_idx" ON "crm_invoices"("status", "dueDate");

-- CreateIndex
CREATE INDEX "crm_invoices_clientId_idx" ON "crm_invoices"("clientId");

-- CreateIndex
CREATE INDEX "crm_invoice_lines_invoiceId_position_idx" ON "crm_invoice_lines"("invoiceId", "position");

-- CreateIndex
CREATE INDEX "crm_payments_invoiceId_idx" ON "crm_payments"("invoiceId");

-- CreateIndex
CREATE INDEX "crm_activities_clientId_createdAt_idx" ON "crm_activities"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "crm_activities_createdAt_idx" ON "crm_activities"("createdAt");

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_client_contacts" ADD CONSTRAINT "crm_client_contacts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_deals" ADD CONSTRAINT "crm_deals_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_milestones" ADD CONSTRAINT "crm_milestones_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "crm_deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_tasks" ADD CONSTRAINT "crm_tasks_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_tasks" ADD CONSTRAINT "crm_tasks_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "crm_deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_notes" ADD CONSTRAINT "crm_notes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_notes" ADD CONSTRAINT "crm_notes_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "crm_deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_notes" ADD CONSTRAINT "crm_notes_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_quotes" ADD CONSTRAINT "crm_quotes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_quotes" ADD CONSTRAINT "crm_quotes_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "crm_deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_quote_lines" ADD CONSTRAINT "crm_quote_lines_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "crm_quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_invoices" ADD CONSTRAINT "crm_invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_invoices" ADD CONSTRAINT "crm_invoices_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "crm_deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_invoices" ADD CONSTRAINT "crm_invoices_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "crm_quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_invoice_lines" ADD CONSTRAINT "crm_invoice_lines_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "crm_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_payments" ADD CONSTRAINT "crm_payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "crm_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "crm_deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "crm_quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "crm_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

