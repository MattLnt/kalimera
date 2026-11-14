-- CreateTable
CREATE TABLE "crm_booking_blocks" (
    "id" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_booking_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "crm_booking_blocks_startsAt_idx" ON "crm_booking_blocks"("startsAt");
