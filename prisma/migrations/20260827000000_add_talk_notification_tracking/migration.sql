-- AlterTable
-- notifiedAt: stamped when the decision email is actually sent (written by the
-- local send tooling, not the app). followUpRequestedAt: set when the speaker
-- asks for more feedback on their decision.
ALTER TABLE "Talk" ADD COLUMN "notifiedAt" TIMESTAMP(3),
                   ADD COLUMN "followUpRequestedAt" TIMESTAMP(3);
