const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Absensi {
  static async getTopicByUser(userId) {
    const data = await prisma.topik.findMany({
      where: {
        userId: userId,
      },
    });
    if (data.length === 0) {
      return "Data not found";
    }
    return data;
  }
  static async getMahasiswaByTopic(trimmedNama, userId) {
    const topic = await prisma.topik.findFirst({
      where: {
        userId,
        ...(trimmedNama && {
          nama: {
            contains: trimmedNama,
            mode: "insensitive",
          },
        }),
      },
      include: {
        topikDetail: {
          select: {
            user_id: true,
            nama: true,
            nim: true,
          },
        },
      },
    });

    if (!topic || !topic.topikDetail.length) {
      return null;
    }

    // Process each detail for the single topic
    const processedDetails = await Promise.all(
      topic.topikDetail.map(async (detail) => {
        const detailLogbooks = await prisma.detailLogbook.findMany({
          where: {
            user_id: detail.user_id,
          },
          include: {
            logbook: true,
          },
        });

        // Calculate attendance counts
        const counts = detailLogbooks.reduce(
          (acc, logbookDetail) => {
            if (!logbookDetail.uploadAt || !logbookDetail.logbook?.tglTerakhir) {
              return acc;
            }

            const uploadAt = new Date(logbookDetail.uploadAt);
            const tglTerakhir = new Date(logbookDetail.logbook.tglTerakhir);

            if (uploadAt <= tglTerakhir) {
              acc.hadir++;
            } else {
              acc.telat++;
            }
            return acc;
          },
          { hadir: 0, telat: 0 }
        );

        return {
          topikNama: topic.nama,
          topikId: topic.id,
          user_id: detail.user_id,
          nama: detail.nama,
          nim: detail.nim,
          hadir: counts.hadir,
          telat: counts.telat,
        };
      })
    );

    return processedDetails;
  }
}

module.exports = Absensi;
