/*
  Warnings:

  - You are about to drop the column `creatcreatedAt` on the `Talk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Talk" DROP COLUMN "creatcreatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
