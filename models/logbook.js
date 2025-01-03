const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 
const HttpRequestError = require('../utils/error');

class Logbook {
    static async allLogbook (){
        const logbook = await prisma.logbook.findMany({
            select : {
                id: true,
                nama: true,
                progress: true,
            }
        });

        console.log(logbook)
        return logbook
    }
    static async allLogbookDetail (){
        try {

            const logbookDetail = await prisma.detailLogbook.findMany({
                select: {
                  id: true,
                  user_id: true,
                  logbookId: true,
                  namaDosen: true,
                  target: true,
                  kendala: true,
                  tanggal: true,
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
              
        
        return logbookDetail
    } catch (error) {
        console.log(error)
        throw new HttpRequestError('Internal Server Error', 500);

    }
}
}

module.exports = Logbook;