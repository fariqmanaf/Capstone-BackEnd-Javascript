// File: validations/auth.js
const HttpRequestError = require("../utils/error");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    register: async ({ name, email, password, noHp, nim }) => {
        const missingFields = [];
        
        if (!name) missingFields.push('name');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!noHp) missingFields.push('noHp');
        if (!nim) missingFields.push('nim');

        if (missingFields.length > 0) {
            console.log('Missing fields:', missingFields);
            throw new HttpRequestError(
                `Validasi gagal. Field berikut belum diisi: ${missingFields.join(', ')}`,
                400
            );
        }

        // Check types
        const invalidTypes = [];
        if (typeof name !== "string") invalidTypes.push('name');
        if (typeof email !== "string") invalidTypes.push('email');
        if (typeof password !== "string") invalidTypes.push('password');
        if (typeof noHp !== "string") invalidTypes.push('noHp');
        if (typeof nim !== "string") invalidTypes.push('nim');

        if (invalidTypes.length > 0) {
            console.log('Invalid type fields:', invalidTypes);
            throw new HttpRequestError(
                `Validasi gagal. Field berikut harus berupa string: ${invalidTypes.join(', ')}`,
                400
            );
        }

        // Validate email format
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            console.log('Invalid email format:', email);
            throw new HttpRequestError(
                "Format email tidak valid. Pastikan Anda memasukkan email dengan format yang benar.",
                400
            );
        }

        // Validate password length
        if (password.length < 8 || password.length > 70) {
            console.log('Invalid password length:', password.length);
            throw new HttpRequestError(
                "Validasi gagal. Password harus memiliki 8 hingga 70 karakter.",
                400
            );
        }

        // Validate phone number
        if (!noHp.startsWith("08") || noHp.length < 11 || noHp.length > 15) {
            console.log('Invalid phone number:', {
                number: noHp,
                length: noHp.length,
                startsWithCorrectPrefix: noHp.startsWith("08")
            });
            throw new HttpRequestError(
                "Validasi gagal. Nomor telepon harus dimulai dengan '08' dan memiliki panjang 11-15 digit.",
                400
            );
        }

        // NIM validation (you might want to add specific format validation for NIM)
        if (nim.length < 5) {
            throw new HttpRequestError(
                "Validasi gagal. NIM tidak valid.",
                400
            );
        }
    },
    login: (data) => {
        const { email, password } = data;

        // Check if fields exist
        if (!email || !password) {
            console.log('Missing login fields:', {
                hasEmail: !!email,
                hasPassword: !!password
            });
            throw new HttpRequestError(
                'Email dan password harus diisi.',
                400
            );
        }

        // Check types
        if (typeof email !== 'string' || typeof password !== 'string') {
            console.log('Invalid type for login fields:', {
                emailType: typeof email,
                passwordType: typeof password
            });
            throw new HttpRequestError(
                'Email dan password harus berupa text.',
                400
            );
        }

        // Validate email format
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            console.log('Invalid email format:', email);
            throw new HttpRequestError(
                'Format email tidak valid.',
                400
            );
        }

        // Validate password length
        if (password.length < 8 || password.length > 70) {
            console.log('Invalid password length:', password.length);
            throw new HttpRequestError(
                'Password harus memiliki 8 hingga 70 karakter.',
                400
            );
        }
    }
};