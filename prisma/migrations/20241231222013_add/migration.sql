-- CreateTable
CREATE TABLE "Logbook" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "progress" TEXT NOT NULL,
    "nama" TEXT,

    CONSTRAINT "Logbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailLogbook" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "logbookId" TEXT NOT NULL,
    "namaDosen" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "kendala" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "rincianKegiatan" TEXT NOT NULL,
    "buktiKegiatan" TEXT NOT NULL,

    CONSTRAINT "DetailLogbook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Logbook" ADD CONSTRAINT "Logbook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailLogbook" ADD CONSTRAINT "DetailLogbook_logbookId_fkey" FOREIGN KEY ("logbookId") REFERENCES "Logbook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailLogbook" ADD CONSTRAINT "DetailLogbook_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
