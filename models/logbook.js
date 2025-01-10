const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const HttpRequestError = require("../utils/error");

class Logbook {
  static async allLogbook() {
    const logbook = await prisma.logbook.findMany({
      select: {
        id: true,
        nama: true,
        progress: true,
      },
    });
    return logbook;
  }
  static async allLogbookDetail() {
    try {
      const logbookDetail = await prisma.detailLogbook.findMany({
        select: {
          id: true,
          user_id: true,
          logbookId: true,
          namaDosen: true,
          target: true,
          kendala: true,
          uploadAt: true,
          output: true,
          rincianKegiatan: true,
          buktiKegiatan: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      return logbookDetail;
    } catch (error) {
      console.log(error);
      throw new HttpRequestError("Internal Server Error", 500);
    }
  }
  static async midllewareCreate(data) {
    try{
      const logbook = await prisma.logbook.findUnique({
        where : {
          id : data
        }, select : {
          progress : true
        }
      })
      const progressSekarang = Number(logbook.progress);
      const progressKemarin = progressSekarang - 1;
      const progressKemarinString = progressKemarin.toString();
      if (progressKemarin !== 0){
        const logbookId = await prisma.logbook.findFirst({
          where : {
            progress : progressKemarinString
          }, select : {
            id : true
          }
        })
  
        const logbookKemarin = await prisma.detailLogbook.findFirst({
          where :{
            logbookId : logbookId.id
          }
        })
  
        if (logbookKemarin === null){
          return {
            success: false,
            message: `Logbook progress ${progressKemarin} belum di buat`,
          }
        }
      }
      return {
        success: true,
      }
    }catch(err){
      console.log(err);
      return {
        success: false,
        message: err,
      }
    }
  }

}

module.exports = Logbook;
