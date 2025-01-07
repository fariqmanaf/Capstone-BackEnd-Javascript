// File: controllers/auth.js
const UserValidation = require("../validations/auth");
const Auth = require("../models/auth");
const JwtHelper = require("../utils/jwtHelper");

module.exports = {
    login: async (req, res, next) => {
        try {            
            UserValidation.login(req.body);
            const { email, password } = req.body;
            const user = await Auth.login(email, password);
            console.log('Login request body:', {
                email: req.body.email,
                hasPassword: !!req.body.password
            });
            const accessToken = JwtHelper.generateToken(user);

            console.log('Login successful for user:', user.email);

            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "Login berhasil.",
                data: {
                    user,
                    accessToken,
                },
            });
        } catch (err) {
            console.error('Login error:', {
                name: err.name,
                message: err.message,
                stack: err.stack,
            });

            // Handle specific error types
            if (err.statusCode === 401) {
                return res.status(401).json({
                    status: "Failed",
                    statusCode: 401,
                    message: err.message || "Email atau password salah.",
                });
            }

            if (err.statusCode === 400) {
                return res.status(400).json({
                    status: "Failed",
                    statusCode: 400,
                    message: err.message || "Data yang dikirim tidak valid.",
                });
            }

            return res.status(500).json({
                status: "Failed",
                statusCode: 500,
                message: "Terjadi kesalahan saat login. Silakan coba lagi.",
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    },
  register: async (req, res, next) => {
    try {
        await UserValidation.register(req.body);
      const data = await Auth.register(req.body);
      return res.status(201).json({
        status: "Success",
        statusCode: 201,
        message: "Registrasi berhasil",
        data: {
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            noHp: data.noHp,
            nim: data.nim
          },
        },
      });
    } catch (err) {
      next(err, "ini error di ctrlr 49");
    }
}
}