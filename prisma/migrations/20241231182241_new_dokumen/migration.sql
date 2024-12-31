/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Dokumen` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Dokumen` table. All the data in the column will be lost.
  - Added the required column `cv` to the `Dokumen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dokumen" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "cv" TEXT NOT NULL;
