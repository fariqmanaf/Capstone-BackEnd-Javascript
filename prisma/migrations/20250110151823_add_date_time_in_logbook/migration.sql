/*
  Warnings:

  - Added the required column `uploadAt` to the `DetailLogbook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tglDibuka` to the `Logbook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tglTerakhir` to the `Logbook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DetailLogbook" ADD COLUMN     "uploadAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Logbook" ADD COLUMN     "tglDibuka" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tglTerakhir" TIMESTAMP(3) NOT NULL;
