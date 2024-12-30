/*
  Warnings:

  - A unique constraint covering the columns `[nim]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nama` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nim` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noHp` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "nim" TEXT NOT NULL,
ADD COLUMN     "noHp" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Dokumen" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transkripNilai" TEXT NOT NULL,
    "dropMatakuliah" TEXT NOT NULL,
    "jumlahMatakuliah" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dokumen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nim_key" ON "User"("nim");

-- AddForeignKey
ALTER TABLE "Dokumen" ADD CONSTRAINT "Dokumen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
