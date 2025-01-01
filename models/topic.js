const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TopicService {
  async createtopic(data, userId) {
    return await prisma.topik.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async getAllTopic() {
    return await prisma.topik.findMany();
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
}

module.exports = new TopicService();