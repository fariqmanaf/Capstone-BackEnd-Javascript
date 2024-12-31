const jwt = require('jsonwebtoken');
const AuthValidation = require('../validations/auth');
const HttpRequestError = require('../utils/error');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

module.exports = {
    mahasiswa: (req, res, next) => {
        try {
            AuthValidation.headers(req.headers);

            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    throw new HttpRequestError('Token tidak valid atau telah kedaluwarsa. Silakan login kembali untuk mendapatkan token baru.', 401);
                }

                if (!(decoded.role === 'mahasiswa')) {
                    throw new HttpRequestError('Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.', 403);
                }

                req.user = decoded;
                next();
            });
        } catch (err) {
            next(err);
        }
    },
    dosen: (req, res, next) => {
        try {
            AuthValidation.headers(req.headers);

            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    throw new HttpRequestError('Token tidak valid atau telah kedaluwarsa. Silakan login kembali untuk mendapatkan token baru.', 401);
                }

                if (!(decoded.role === 'dosen')) {
                    throw new HttpRequestError('Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.', 403);
                }

                req.user = decoded;
                next();
            });
        } catch (err) {
            next(err);
        }
    },
    userParams :async (req,res,next) => {
      try {
        const token = req.headers.authorization?.split(' ')[1]; // Mendapatkan token dari header Authorization
    
        if (!token) {
          return res.status(401).json({
            status: 'Failed',
            statusCode: 401,
            message: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
          });
        }
    
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select : {
            id : true,
            name : true,
            email : true,
            nim : true,
            noHp : true,
          }
        });
    
        if (!user) {
          return res.status(404).json({
            status: 'Failed',
            statusCode: 404,
            message: 'User tidak ditemukan.',
          });
        }
    
        req.user = user; // Tambahkan data user ke req
        next();
      } catch (err) {
        console.error('Auth Middleware Error:', err);
        return res.status(401).json({
          status: 'Failed',
          statusCode: 401,
          message: 'Token tidak valid atau telah kedaluwarsa.',
        });
      }
    }
};