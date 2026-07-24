-- AlterTable
ALTER TABLE "Talk" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending';

-- Backfill from the legacy status booleans so already-decided talks don't
-- land on the 'pending' default.
UPDATE "Talk" SET "status" = CASE
  WHEN "IsPendingReview" THEN 'pending'
  WHEN "IsAccepted" THEN 'accepted'
  ELSE 'rejected'
END;
