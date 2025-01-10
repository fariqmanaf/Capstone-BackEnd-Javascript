const ImageKit = require("imagekit");
const Error = require("../utils/errorHandler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Validation = require("../validations/logbook");
const Logbook = require("../models/logbook");
const { response } = require("express");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

module.exports = {
  makeLogbook: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { progress, nama } = req.body;
      const validation = await Validation.makeLogbook(progress);
      if (!validation.success) {
        return res.status(400).json({
          status: "Failed",
          message: validation.message,
        });
      }

      const data = await prisma.logbook.create({
        data: {
          progress,
          userId,
          nama,
        },
      });

      return res.status(201).json({
        status: "Success",
        message: "Logbook berhasil dibuat",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        message: err || err.message + " ini error",
      });
    }
  },
  getLogbook: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const data = await Logbook.allLogbook();

      return res.status(200).json({
        status: "Success",
        message: "Logbook berhasil diambil",
        data: data,
      });
    } catch (err) {
      return res.status(500).json({
        status: "Failed",
        message: err || err.message + " ini error",
      });
    }
  },
  makeLogbookDetail: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const logbookId = req.params.id;
      
      const midlleware = await Logbook.midllewareCreate(logbookId);

      if (!midlleware.success) {
        return res.status(400).json({
          status: "Failed",
          message: midlleware.message,
        });
      }

      const { namaDosen, target, kendala, tanggal, output, rincianKegiatan } = req.body;

      if (!namaDosen) {
        return res.status(400).json({
          status: "Failed",
          message: "Nama Dosen tidak boleh kosong",
        });
      }
      if (!target) {
        return res.status(400).json({
          status: "Failed",
          message: "Target tidak boleh kosong",
        });
      }
      if (!kendala) {
        return res.status(400).json({
          status: "Failed",
          message: "Kendala tidak boleh kosong",
        });
      }
      if (!tanggal) {
        return res.status(400).json({
          status: "Failed",
          message: "Tanggal tidak boleh kosong",
        });
      }
      if (!output) {
        return res.status(400).json({
          status: "Failed",
          message: "Output tidak boleh kosong",
        });
      }

      if (!rincianKegiatan){
        return res.status(400).json({
          status: "Failed",
          message: "Rincian Kegiatan tidak boleh kosong",
        });
      }

      if (!req.file) {
        return res.status(400).json({
            status: 'Failed',
            message: 'File bukti kegiatan tidak ditemukan',
        });
    }

      const uploadImageKit = await imagekit.upload({
        file: req.file.buffer.toString("base64"),
        fileName: req.file.originalname,
        folder: "logbook",
      });

      const logbookfile = uploadImageKit.url;
      const data = await prisma.detailLogbook.create({
        data: {
          namaDosen: namaDosen,
          target: target,
          user_id: userId,
          kendala: kendala,
          tanggal: tanggal,
          output: output,
          buktiKegiatan: logbookfile,
          rincianKegiatan : rincianKegiatan,
          logbookId: logbookId,
          uploadAt : new Date()
        },
      });

      return res.status(201).json({
        status: "Success",
        message: "Logbook Detail berhasil dibuat",
        data: data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        message: err || err.message + " ini error di controller logbook",
      });
    }
  },
  getLogbookDetail: async (req, res, next) => {
    try {
      const data = await Logbook.allLogbookDetail();

      return res.status(200).json({
        status: "Success",
        message: "Logbook Detail berhasil diambil",
        data: data,
      });
    } catch (err) {
      return res.status(500).json({
        status: "Failed",
        message: err || err.message + " ini error",
      });
    }
  },
  getLogbookDetailById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await prisma.detailLogbook.findUnique({
        where: {
          id: id,
        },
      });

      return res.status(200).json({
        status: "Success",
        message: "Logbook Detail berhasil diambil",
        data: data,
      });
    } catch (err) {
      return res.status(500).json({
        status: "Failed",
        message: err || err.message + " ini error",
      });
    }
  },
  
};
