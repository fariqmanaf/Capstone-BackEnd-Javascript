// src/controllers/user.js
const ImageKit = require('imagekit');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const UserValidation = require('../validations/user');
const UserModel = require('../models/user');
const HttpRequestError = require("../utils/error");


const prisma = new PrismaClient();
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

class UserController {
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      console.log(isPasswordValid)
      if (!isPasswordValid) {
        throw new HttpRequestError('Password lama salah', 400);
      }
      console.log(newPassword, confirmPassword)

        if (newPassword !== confirmPassword) {
            throw new HttpRequestError('Password baru dan konfirmasi password tidak sama', 400);
        }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      const data = await prisma.user.findUnique({
        where: { id: userId }
      });

      res.status(201).json({ 
        message: 'Password updated successfully',
        status: 'success',
        data : data

        });
    } catch (error) {
      res.status(500).json({ 
        status: 'Failed',
        error: error.message 
    });
    }
  }

  static async uploadDocuments(req, res) {
    try {
      const userId = req.user.id;

      const { dropMatakuliah, jumlahMatakuliah } = req.body;

      console.log(dropMatakuliah, jumlahMatakuliah);
      console.log(req.body);
      
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

    if ( !req.files.cv) {
        throw new Error ("CV wajib diisi") 
    }
    if ( !req.files.transkripNilai) {
        throw new Error ("Transkrip Nilai wajib diisi")
    }
    
    if (!dropMatakuliah) {
        throw new Error ("Drop Matakuliah wajib diisi")
    }

    if (!jumlahMatakuliah) {
        throw new Error ("Jumlah Matakuliah wajib diisi")
    }

    const uploadedFiles = {};

      // Handle transcript upload
      if (req.files.transkripNilai) {
        const transcriptFile = req.files.transkripNilai[0];
        if (!UserController.validateFile(transcriptFile)) {
          return res.status(400).json({ error: 'Invalid transcript file. Only PDF files are allowed (max 5MB)' });
        }

        // Get file extension from original filename
        const fileExt = transcriptFile.originalname.split('.').pop();
        const transcriptUpload = await imagekit.upload({
          file: transcriptFile.buffer,
          fileName: `transcript-${userId}-${Date.now()}.${fileExt}`,
          folder: 'transcripts'
        });
        uploadedFiles.transkripNilai = transcriptUpload.url;
      }

      // Handle CV upload
      if (req.files.cv) {
        const cvFile = req.files.cv[0];
        if (!UserController.validateFile(cvFile)) {
          return res.status(400).json({ error: 'Invalid CV file. Only PDF files are allowed (max 5MB)' });
        }

        // Get file extension from original filename
        const fileExt = cvFile.originalname.split('.').pop();
        const cvUpload = await imagekit.upload({
          file: cvFile.buffer,
          fileName: `cv-${userId}-${Date.now()}.${fileExt}`,
          folder: 'cvs'
        });
        uploadedFiles.cv = cvUpload.url;
      }

      const document = await prisma.dokumen.upsert({
        where: { userId },
        create: {
          userId,
          transkripNilai: uploadedFiles.transkripNilai,
          cv: uploadedFiles.cv,
          dropMatakuliah: dropMatakuliah,
          jumlahMatakuliah: jumlahMatakuliah
        },
        update: {
          ...(uploadedFiles.transkripNilai && { transkripNilai: uploadedFiles.transkripNilai }),
          ...(uploadedFiles.cv && { cv: uploadedFiles.cv }),
          ...(dropMatakuliah && { dropMatakuliah: dropMatakuliah }),
          ...(jumlahMatakuliah && { jumlahMatakuliah: jumlahMatakuliah })
        }
      });

      res.status(201).json({
        message: 'Documents uploaded successfully',
        status : 'success',
        data: document
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static validateFile(file) {
    const allowedMimeTypes = [
      'application/pdf'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return (
      allowedMimeTypes.includes(file.mimetype) &&
      file.size <= maxSize
    );
  }

  static async getProfile(req, res, next) {
    try {
        const user = req.user;

        await UserValidation.getprofile2(user.email);
        const data = await UserModel.profile(user.id)
        res.status(200).json({
            status: 'success',
            data: data
        });

    }catch (error) {
      res.status(500).json({ 
        status: 'Failed',
        error: error.message + "ini error"
        });
    }
    }

  static async getDocument(req, res) {
    try {
      const userId = req.params.id;
      const document = await prisma.dokumen.findUnique({
        where: { userId },
        include : {
          user : {
            select : {
              name: true,
              email: true,
              nim: true,
              noHp: true,
            }
          }
        }
      });


      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.status(200).json({ 
        status: 'success',
        data: document
    });
    } catch (error) {
      res.status(500).json({ 
        status: 'Failed',
        error: error.message 
    });
    }
  }
  static async getMyActivity(req, res) {
    try {
      const user_id = req.user.id;
      const data = await prisma.topikDetail.findFirst({
        where : {
          user_id : user_id
        },include : {
          topik : true
        }
        }); 
      if (!data) {
        return res.status(200).json({ 
          status: 'success',
          message: 'kamu belum ikut apa apa alias nolep cok'
         });
      }
      return res.status(200).json({
        status: 'success',
        data: data
      });
    }catch (error) {
      console.log(error);
      res.status(500).json({ 
        status: 'Failed',
        error: error.message 
    });
    }
  }
}

module.exports = UserController;