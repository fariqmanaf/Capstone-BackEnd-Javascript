const jwt = require('jsonwebtoken');
const AuthValidation = require('../validations/auth');
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
};