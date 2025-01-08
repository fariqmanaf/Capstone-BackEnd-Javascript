const HttpRequestError = require("../utils/error");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    makeLogbook: async (progress) => {
        if (!progress) {
          return {
            success: false,
            message: "Progress tidak boleh kosong",
          };
        }
    
        const findlogbook = await prisma.logbook.findFirst({
          where: {
            progress: progress,
          },
        });
    
        if (findlogbook) {
          return {
            success: false,
            message: "Progress sudah ada",
          };
        }
    
        // Jika validasi berhasil
        return {
          success: true,
        };
    },
}