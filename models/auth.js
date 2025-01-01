// File: models/auth.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 
const bcrypt = require('bcrypt');
const HttpRequestError = require('../utils/error');

class Auth {
    static async register({ name, email, password, nim, noHp, role }) {
        try {
            // Check for unique constraints before attempting to create
            const existingNim = await prisma.user.findUnique({
                where: { nim: String(nim) }
            });

            if (existingNim) {
                throw new HttpRequestError('NIM sudah terdaftar.', 409);
            }

            const existingEmail = await prisma.user.findUnique({
                where: { email: String(email) }
            });

            if (existingEmail) {
                throw new HttpRequestError('Email sudah terdaftar.', 409);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name: String(name),
                    email: String(email),
                    password: hashedPassword,
                    nim: String(nim),
                    noHp: String(noHp),
                    role: role || 'mahasiswa'
                }
            });

            console.log('User created successfully:', user.id);

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                noHp: user.noHp,
                nim: user.nim,
                role: user.role
            };
        } catch (error) {
            console.error('Registration error:', {
                name: error.name,
                message: error.message,
                code: error.code
            });

            if (error instanceof HttpRequestError) {
                throw error;
            }

            // Handle Prisma-specific errors
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0];
                const message = field === 'email' 
                    ? 'Email sudah terdaftar.' 
                    : field === 'nim'
                    ? 'NIM sudah terdaftar.'
                    : 'Data sudah terdaftar.';
                throw new HttpRequestError(message, 409);
            }

            throw new HttpRequestError(
                'Terjadi kesalahan saat mendaftarkan user. Silakan coba lagi.',
                500
            );
        }
    }

    static async login(email, password) {
        try {
            const user = await prisma.user.findUnique({
                where: { email: String(email) },
            });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new HttpRequestError('Email atau kata sandi yang Anda masukkan salah.', 401);
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                noHp: user.noHp,
                role: user.role,
                nim: user.nim
            };
        } catch (error) {
            console.error('Login error:', {
                name: error.name,
                message: error.message
            });

            if (error instanceof HttpRequestError) {
                throw error;
            }

            throw new HttpRequestError(
                'Terjadi kesalahan saat login. Silakan coba lagi.',
                500
            );
        }
    }
}

module.exports = Auth;
