-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BookingMode" AS ENUM ('VIDEO', 'PHONE');

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "mode" "BookingMode" NOT NULL DEFAULT 'VIDEO',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "topic" TEXT,
    "message" TEXT,
    "locale" "Locale" NOT NULL DEFAULT 'FR',
    "meetingUrl" TEXT,
    "token" TEXT NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_token_key" ON "bookings"("token");

-- CreateIndex
CREATE INDEX "bookings_status_startsAt_idx" ON "bookings"("status", "startsAt");
