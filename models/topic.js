const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
      }
    });
  }


  async getAllTopic() {
    return await prisma.topik.findMany({
      include: {
        role: {
          select: {
            nama: true
          }
        },
        user : {
          select : {
            name : true
          }
        }
      }
    });
  }

  async getTopicById(id) {
    return await prisma.topik.findFirst({
      where: { id }
    });
}

  async deletetTopic(id, userId) {
    const topic = await prisma.topik.findFirst({
      where: { id, userId }
    });

    if (!topic) {
      throw new Error('topic not found or unauthorized');
    }

    return await prisma.topik.delete({
      where: { id }
    });
  }

  async createTopikDetail(data, topikId, userId) {
    return await prisma.topikDetail.create({
      data: {
        ...data,
        topikId,
        user_id: userId
      }
    });
  }
  async deleteTopic(id, userId) {
    const topic = await prisma.topik.findFirst({
      where: { id, userId }
    });

    if (!topic) {
      throw new Error('topic not found');
    }

    await prisma.topikDetail.deleteMany({
      where: { topikId: id }
    });

    return await prisma.topik.delete({
      where: { id }
    });
  }
  async getPendaftarTopic() {
    return await prisma.topikDetail.findMany({
      where : {
        konfirmasi : "belum"
      }
    });
  }
  async getPendaftarTopicAcc() {
    return await prisma.topikDetail.findMany({
      where : {
        konfirmasi : "sudah"
      }
    });
  }

  async updatePendaftarTopic(id) {
    console.log(id, "ini idnya");
    const existingRecord = await prisma.topikDetail.findUnique({
      where: { id },
    });
  
    if (!existingRecord) {
      throw new Error(`Record with ID ${id} not found`);
    }

    return await prisma.topikDetail.update({
      where: { id },
      data: {
        konfirmasi: "sudah"
      }
    });
  }
  async deletePendaftarTopic(id) {
    return await prisma.topikDetail.delete({
      where: { id }
    });
  }

  async getPendaftarTopicFilter(data) {
    const inidatanya = await prisma.topikDetail.findMany({
      where: {
        nama : data
      }
    });

    if (!inidatanya) {
      return res.status(400).json({
        status: "failed",
        message: "nama tidak ditemukan"
      })
    }
    return inidatanya;
  }
  async getPendaftarTopicAccFilter(data) {
    const inidatanya = await prisma.topikDetail.findMany({
      where: {
        nama : data,
        konfirmasi : "sudah"
      }
    });

    if (!inidatanya) {
      return res.status(400).json({
        status: "failed",
        message: "nama tidak ditemukan"
      })
    }
    return inidatanya;
  }

}

module.exports = new TopicService();