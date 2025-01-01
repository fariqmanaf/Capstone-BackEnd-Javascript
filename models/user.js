const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 
const HttpRequestError = require('../utils/error');

class User {
    static async profile (id){
        const user = await prisma.user.findUnique({
            where: { id: id },
        select : {
            name: true,
            email: true,
            nim: true,
            noHp: true,
        }
    });

        return user
    }
}

module.exports = User;