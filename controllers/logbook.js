const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 
const Validation = require('../validations/logbook');
const Logbook = require('../models/logbook');

module.exports = {
    makeLogbook: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { progress, nama } = req.body;
            await Validation.makeLogbook( progress );

            const data = await prisma.logbook.create({
                data: {
                    progress,
                    userId,
                    nama
                }
            });
            
            return res.status(201).json({
                status: 'Success',
                message: 'Logbook berhasil dibuat',
                data
            });

        } catch (err) {
            return res.status(500).json({
                status: 'Failed',
                message: err || err.message + " ini error"
            });
        }
    },
    getLogbook: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const data = await Logbook.getLogbook(userId);

            return res.status(200).json({
                status: 'Success',
                message: 'Logbook berhasil diambil',
                data
            });

        } catch (err) {
            return res.status(500).json({
                status: 'Failed',
                message: err || err.message + " ini error"
            });
        }
    },
}


