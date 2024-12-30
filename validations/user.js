const HttpRequestError = require("../utils/error");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    getprofile : async (data) => {
        const {email} = data;

        const findUser = await prisma.user.findUnique({
            where : {
                email : email
            }
        });

        if (!findUser){
            throw new HttpRequestError("Pengguna tidak ditemukan. Pastikan email benar.", 404);
        }
}   }