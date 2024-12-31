/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Dokumen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dokumen_userId_key" ON "Dokumen"("userId");
