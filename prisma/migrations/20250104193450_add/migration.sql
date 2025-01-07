-- AlterTable
ALTER TABLE "TopikDetail" ADD COLUMN     "konfirmasi" TEXT NOT NULL DEFAULT 'belum';

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "topikId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_topikId_fkey" FOREIGN KEY ("topikId") REFERENCES "Topik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
