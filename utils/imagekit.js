const ImageKit = require('imagekit');
const { PrismaClient } = require('@prisma/client');

class DocumentService {
  constructor() {
    this.prisma = new PrismaClient();
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }

  async uploadDocument(userId, files) {
    try {
      // Ensure both files are provided
      if (!files.transkripNilai || files.transkripNilai.length === 0) {
        throw new Error('transkripNilai is required and must be provided.');
      }

      if (!files.cv || files.cv.length === 0) {
        throw new Error('CV is required and must be provided.');
      }

      const uploadedFiles = {};

      // Handle transcript upload
      const transcriptFile = files.transkripNilai[0];
      if (!this.validateFile(transcriptFile)) {
        throw new Error('Invalid transcript file. Only PDF files are allowed (max 5MB).');
      }
      const transcriptUpload = await this.uploadToImageKit(userId, transcriptFile, 'transcripts');
      uploadedFiles.transkripNilai = transcriptUpload.url;

      // Handle CV upload
      const cvFile = files.cv[0];
      if (!this.validateFile(cvFile)) {
        throw new Error('Invalid CV file. Only PDF files are allowed (max 5MB).');
      }
      const cvUpload = await this.uploadToImageKit(userId, cvFile, 'cvs');
      uploadedFiles.cv = cvUpload.url;

      // Ensure both uploads were successful
      if (!uploadedFiles.transkripNilai || !uploadedFiles.cv) {
        throw new Error('Failed to upload one or more required files.');
      }

      // Create or update document record in database
      const document = await this.prisma.dokumen.upsert({
        where: { userId },
        create: {
          userId,
          transkripNilai: uploadedFiles.transkripNilai,
          cv: uploadedFiles.cv,
          dropMatakuliah: '',
          jumlahMatakuliah: '',
        },
        update: {
          transkripNilai: uploadedFiles.transkripNilai,
          cv: uploadedFiles.cv,
        },
      });

      return document;
    } catch (error) {
      throw new Error(`Failed to upload document: ${error.message}`);
    }
  }

  validateFile(file) {
    const allowedMimeTypes = ['application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return false;
    }

    if (file.size > maxSize) {
      return false;
    }

    return true;
  }

  async uploadToImageKit(userId, file, folder) {
    const fileExt = file.originalname.split('.').pop(); // Get file extension
    return await this.imagekit.upload({
      file: file.buffer,
      fileName: `${folder}-${userId}-${Date.now()}.${fileExt}`,
      folder: folder,
    });
  }

  async getDocument(userId) {
    try {
      const document = await this.prisma.dokumen.findUnique({
        where: { userId },
      });

      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    } catch (error) {
      throw new Error(`Failed to get document: ${error.message}`);
    }
  }
}

module.exports = new DocumentService();
