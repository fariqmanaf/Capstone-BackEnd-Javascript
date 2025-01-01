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
}

module.exports = Logbook;