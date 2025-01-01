const HttpRequestError = require("../utils/error");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    makeLogbook : async (progress) => {
        const findlogbook = await prisma.logbook.findFirst({
            where : {
                progress : progress
            }
        });


        if (findlogbook){
            res.status(400).json({
                status : "Failed",
                message : "Progress sudah ada",
            });
        }
        if (!progress){
            res.status(400).json({
                status : "Failed",
                message : "Progress tidak boleh kosong",
            });
        }
        
    }
}