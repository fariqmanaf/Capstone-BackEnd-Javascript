-- CreateTable
CREATE TABLE "Topik" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Topik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopikDetail" (
    "id" TEXT NOT NULL,
    "topikId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "prodi" TEXT NOT NULL,
    "role1" TEXT NOT NULL,
    "role2" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "TopikDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Topik" ADD CONSTRAINT "Topik_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopikDetail" ADD CONSTRAINT "TopikDetail_topikId_fkey" FOREIGN KEY ("topikId") REFERENCES "Topik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopikDetail" ADD CONSTRAINT "TopikDetail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
