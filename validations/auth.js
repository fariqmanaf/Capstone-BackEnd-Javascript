const HttpRequestError = require('../utils/error');

module.exports = {
    headers: (headers) => {
        if (!headers.authorization) {
            throw new HttpRequestError('Authorization header tidak ditemukan.', 400);
        }
        if (!headers.authorization.startsWith('Bearer ')) {
            throw new HttpRequestError('Format Authorization header tidak valid. Gunakan format Bearer <token>.', 400);
        }
    },
    register: async ({ name, email, password, noHp, nim }) => {
        const missingFields = [];
        
        if (!name) missingFields.push('name');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!noHp) missingFields.push('noHp');
        if (!nim) missingFields.push('nim');

        if (missingFields.length > 0) {
            throw new HttpRequestError(
                `Field berikut belum diisi: ${missingFields.join(', ')}`,
                400
            );
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            throw new HttpRequestError('Format email tidak valid.', 400);
        }

        if (password.length < 8 || password.length > 70) {
            throw new HttpRequestError('Password harus memiliki panjang 8 hingga 70 karakter.', 400);
        }

        if (!noHp.startsWith('08') || noHp.length < 11 || noHp.length > 15) {
            throw new HttpRequestError('Nomor telepon harus dimulai dengan "08" dan memiliki panjang 11-15 digit.', 400);
        }

        if (nim.length < 5) {
            throw new HttpRequestError('NIM tidak valid.', 400);
        }
    },
    login: ({ email, password }) => {
        if (!email || !password) {
            throw new HttpRequestError('Email dan password harus diisi.', 400);
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            throw new HttpRequestError('Format email tidak valid.', 400);
        }

        if (password.length < 8 || password.length > 70) {
            throw new HttpRequestError('Password harus memiliki panjang 8 hingga 70 karakter.', 400);
        }
    },
};
