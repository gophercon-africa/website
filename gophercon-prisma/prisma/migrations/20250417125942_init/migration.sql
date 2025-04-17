-- CreateTable
CREATE TABLE "Talk" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "talkTitle" TEXT NOT NULL,
    "talkDescription" TEXT NOT NULL,
    "talkDuration" TEXT NOT NULL,
    "talkLevel" TEXT NOT NULL,
    "previousSpeakingExperience" TEXT NOT NULL,
    "additionalNotes" TEXT NOT NULL,
    "eventYear" TEXT NOT NULL,
    "IsAccepted" BOOLEAN NOT NULL,
    "IsPendingReview" BOOLEAN NOT NULL,
    "creatcreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Talk_pkey" PRIMARY KEY ("id")
);
