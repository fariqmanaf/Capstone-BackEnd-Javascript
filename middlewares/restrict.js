const jwt = require('jsonwebtoken');
const AuthValidation = require('../validations/auth');
const HttpRequestError = require('../utils/error');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

module.exports = {
    mahasiswa: async (req, res, next) => {
        try {
            AuthValidation.headers(req.headers);

            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            if (decoded.role !== 'mahasiswa') {
                throw new HttpRequestError('Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.', 403);
            }

            req.user = decoded;
            next();
        } catch (err) {
            res.status(err.statusCode || 401).json({
                status: 'Failed',
                statusCode: err.statusCode || 401,
                message: err.message || 'Token tidak valid atau telah kedaluwarsa.',
            });
        }
    },
    dosen: async (req, res, next) => {
        try {
            AuthValidation.headers(req.headers);

            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            if (decoded.role !== 'dosen') {
                throw new HttpRequestError('Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.', 403);
            }

            req.user = decoded;
            next();
        } catch (err) {
            res.status(err.statusCode || 401).json({
                status: 'Failed',
                statusCode: err.statusCode || 401,
                message: err.message || 'Token tidak valid atau telah kedaluwarsa.',
            });
        }
    },
    userParams: async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new HttpRequestError('Token tidak ditemukan. Silakan login terlebih dahulu.', 401);
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    nim: true,
                    noHp: true,
                },
            });

            if (!user) {
                throw new HttpRequestError('User tidak ditemukan.', 404);
            }

            req.user = user;
            next();
        } catch (err) {
            res.status(err.statusCode || 401).json({
                status: 'Failed',
                statusCode: err.statusCode || 401,
                message: err.message || 'Token tidak valid atau telah kedaluwarsa.',
            });
        }
    },
    allUser : async (req, res, next) => {
        try {
            AuthValidation.headers(req.headers);

            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            if (decoded.role !== 'mahasiswa' && decoded.role !== 'dosen') {
                throw new HttpRequestError('Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.', 403);
            }

            req.user = decoded;
            next();
        } catch (err) {
            res.status(err.statusCode || 401).json({
                status: 'Failed',
                statusCode: err.statusCode || 401,
                message: err.message || 'Token tidak valid atau telah kedaluwarsa.',
            });
        }
    },
};
