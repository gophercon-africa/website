-- CreateTable
CREATE TABLE "OtpToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OtpToken_email_idx" ON "OtpToken"("email");

-- CreateIndex
CREATE INDEX "OtpToken_tokenHash_idx" ON "OtpToken"("tokenHash");

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "talkId" TEXT NOT NULL,
    "reviewerEmail" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_talkId_reviewerEmail_key" ON "Review"("talkId", "reviewerEmail");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_talkId_fkey" FOREIGN KEY ("talkId") REFERENCES "Talk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
