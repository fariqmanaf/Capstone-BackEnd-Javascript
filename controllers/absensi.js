const Absensi = require("../models/absensi");

module.exports = {
  getTopicByUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const data = await Absensi.getTopicByUser(userId);
      return res.status(200).json({
        status: "Success",
        message: "Topic berhasil diambil",
        data: data,
      });
    } catch (err) {
      return res.status(500).json({
        status: "Failed",
        message: err || err.message + " ini error",
      });
    }
  },
  getMahasiswaByTopic: async (req, res) => {
    try {
      const userId = req.user.id;
      const { topic } = req.query; // nama dari query params

      const trimmedNama = topic ? topic.trim() : "";
      console.log(trimmedNama, "ini trimmedNama");
      
      const data = await Absensi.getMahasiswaByTopic(trimmedNama, userId);
      
      if (!data || data.length === 0) {
        return res.status(404).json({
          status: "Failed",
          message: "Data Mahasiswa atau Topic tidak ditemukan.",
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "Topic berhasil diambil",
        data: data,
      });
    } catch (err) {
        console.log(err);
      return res.status(500).json({
        status: "Failed",
        message: err || err.message + " ini error",
      });
    }
  },
  checkAttendance: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          status: "Failed",
          message: "User ID is required",
        });
      }

      const data = await Absensi.getAttendanceDetails(userId);
      
      return res.status(200).json({
        status: "Success",
        message: "Data absensi berhasil diambil",
        data: data,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "Failed",
        message: err.message || "Internal server error",
      });
    }
  },
};
