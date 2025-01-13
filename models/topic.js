const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const HttpRequestError = require("../utils/error");

class TopicService {
  async createtopic(data, userId) {
    const { nama, deskripsi, roles } = data;

    return await prisma.topik.create({
      data: {
        nama,
        deskripsi,
        userId,
        role: {
          create: roles.map((roleName) => ({ nama: roleName })),
        },
      },
    });
  }

  async getAllTopic() {
    return await prisma.topik.findMany({
      include: {
        role: {
          select: {
            nama: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getTopicById(id) {
    return await prisma.topik.findFirst({
      where: { id },
      include: {
        role: {
          select: {
            nama: true,
          },
        },
      },
    });
  }

  async deletetTopic(id, userId) {
    const topic = await prisma.topik.findFirst({
      where: { id, userId },
    });

    if (!topic) {
      throw new Error("topic not found or unauthorized");
    }

    return await prisma.topik.delete({
      where: { id },
    });
  }

  async createTopikDetail(data, topikId, userId) {
    const topic = await prisma.topik.findFirst({
      where: { id: topikId },
    });
    if (!topic) {
      throw new Error("topic not found");
    }
    return await prisma.topikDetail.create({
      data: {
        ...data,
        topikId,
        user_id: userId,
      },
    });
  }
  async deleteTopic(id, userId) {
    const topic = await prisma.topik.findFirst({
      where: { id, userId },
    });

    if (!topic) {
      throw new Error("topic not found");
    }

    await prisma.topikDetail.deleteMany({
      where: { topikId: id },
    });

    await prisma.role.deleteMany({
      where: { topikId: id },
    });

    return await prisma.topik.delete({
      where: { id },
    });
  }
  async getPendaftarTopic(userId) {
    const topics = await prisma.topik.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    const topicIds = topics.map((topic) => topic.id);
    const data = await prisma.topikDetail.findMany({
      where: {
        konfirmasi: "belum",
        topikId: {
          in: topicIds, // Pastikan `topikId` termasuk dalam array `topicIds`
        },
      },
      include: {
        topik: true,
        user: {
          select: {
            name: true,
            email: true,
            noHp: true,
            nim: true,
            dokumen: true,
          },
        },
      },
    });

    if (!data || data.length === 0) {
      return {
        message: "data tidak ditemukan",
      };
    }
    return data;
  }
  async getPendaftarTopicAcc(userId) {
    const topics = await prisma.topik.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    const topicIds = topics.map((topic) => topic.id);

    const data = await prisma.topikDetail.findMany({
      where: {
        konfirmasi: "sudah",
        topikId: {
          in: topicIds, // Pastikan `topikId` termasuk dalam array `topicIds`
        },
      },
      include: {
        topik: true,
        user: {
          select: {
            name: true,
            email: true,
            noHp: true,
            nim: true,
            dokumen: true,
          },
        },
      },
    });

    if (!data || data.length === 0) {
      return {
        status: "failed",
        message: "data tidak ditemukan",
      };
    }
    return data;
  }

  async updatePendaftarTopic(id, role1) {
    const existingRecord = await prisma.topikDetail.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new Error(`Record with ID ${id} not found`);
    }

    return await prisma.topikDetail.update({
      where: { id },
      data: {
        role1: role1, // Perbarui role1 dengan nilai baru
        role2: "", // Kosongkan role2
        konfirmasi: "sudah",
      },
    });
  }
  async deletePendaftarTopic(id) {
    return await prisma.topikDetail.delete({
      where: { id },
    });
  }

  async getPendaftarTopicFilter(data, userId) {

    const topics = await prisma.topik.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
    const topicIds = topics.map((topic) => topic.id);
    const datas = await prisma.topikDetail.findMany({
      where: {
        konfirmasi: "belum",
        nama: data,
        topikId: {
          in: topicIds, // Pastikan `topikId` termasuk dalam array `topicIds`
        },
      },
      include: {
        topik: true,
        user: {
          select: {
            name: true,
            email: true,
            noHp: true,
            nim: true,
            dokumen: true,
          },
        },
      },
    });

    if (!datas || datas.length === 0) {
      return {
        message: "data tidak ditemukan",
      };
    }
    
    return datas;
  }
  async getPendaftarTopicAccFilter(data, userId) {
    const topics = await prisma.topik.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
    const topicIds = topics.map((topic) => topic.id);
    const datas = await prisma.topikDetail.findMany({
      where: {
        konfirmasi: "sudah",
        nama: data,
        topikId: {
          in: topicIds, // Pastikan `topikId` termasuk dalam array `topicIds`
        },
      },
      include: {
        topik: true,
        user: {
          select: {
            name: true,
            email: true,
            noHp: true,
            nim: true,
            dokumen: true,
          },
        },
      },
    });

    if (!datas || datas.length === 0) {
      return {
        message: "data tidak ditemukan",
      };
    }
    console.log(datas, "ini data");
    return datas;
  }
  async updateTopic(id, data, userId) {
    const topic = await prisma.topik.findFirst({
      where: { id },
    });

    const { nama, deskripsi, roles } = data;

    if (!topic) {
      throw new Error("topic not found or unauthorized");
    }
    return await prisma.topik.update({
      where: { id: topic.id },
      data: {
        nama: nama || topic.nama,
        deskripsi: deskripsi || topic.deskripsi,
        role: roles
          ? {
              deleteMany: {}, // Hapus semua role lama
              create: roles
                .filter((roleName) => roleName && typeof roleName === "string") // Filter role yang valid
                .map((roleName) => ({ nama: roleName })), // Tambahkan role baru
            }
          : undefined,
      },
      include: {
        role: {
          select: { nama: true }, // Sertakan hanya nama dari role
        },
      },
    });
  }
  async getRole(id) {
    console.log(id, "ini userId yang ada di model");
    const role = await prisma.topikDetail.findFirst({
      where: { id },
      select: {
        role1: true,
        role2: true,
      },
    });
    console.log(role, "ini role");
    if (!role) {
      throw new Error("role not found");
    }
    return role;
  }
  async deleteTopicLain(userId) {
    try {
      await prisma.topikDetail.deleteMany({
        where: {
          user_id: userId,
          konfirmasi: "belum",
        },
      });
      return {
        status: "Success",
        message: "data berhasil dihapus",
      };
    } catch (error) {
      console.log(error);
      return {
        status: "Failed",
        message: error,
      };
    }
  }
}

module.exports = new TopicService();
