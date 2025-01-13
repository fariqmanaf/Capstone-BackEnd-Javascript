const HttpRequestError = require("../utils/error");
const Topic = require("../models/topic");
const middlewares = require("../middlewares/restrict");
class TopicController {
  async createTopic(req, res) {
    try {
      const { nama, deskripsi } = req.body;
      if (!nama || typeof nama !== "string") {
        throw new HttpRequestError("Nama is required and must be a string");
      }

      if (!deskripsi || typeof deskripsi !== "string") {
        throw new HttpRequestError("Deskripsi is required and must be a string");
      }
      const topic = await Topic.createtopic(req.body, req.user.id);
      console.log(topic);
      res.status(201).json(topic);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  }

  async getAllTopic(req, res) {
    try {
      const topics = await Topic.getAllTopic();
      res.status(200).json(topics);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getTopicById(req, res) {
    try {
      const topic = await Topic.getTopicById(req.params.id);
      if (!topic) {
        return res.status(404).json({ message: "topic not found" });
      }
      res.status(200).json(topic);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteTopic(req, res) {
    try {
      const delet = await Topic.deleteTopic(req.params.id, req.user.id);
      res.status(200).json({ message: "topic deleted successfully" });
    } catch (error) {
      if (error.message === "topic not found or unauthorized") {
        return res.status(404).json({ message: error.message });
      }
      console.log(error);
      res.status(500).json({
        status: "Failed",
        message: delet.message || error.message,
      });
    }
  }

  async createTopikDetail(req, res) {
    try {
      const { nama, nim, prodi, role1, role2, noHp } = req.body;

      if (!nama || typeof nama !== "string") {
        throw new HttpRequestError("Nama is required and must be a string");
      }

      if (!nim || typeof nim !== "string") {
        throw new HttpRequestError("NIM is required and must be a string");
      }

      if (!prodi || typeof prodi !== "string") {
        throw new HttpRequestError("Prodi is required and must be a string");
      }

      if (!role1 || typeof role1 !== "string") {
        throw new HttpRequestError("Role1 is required and must be a string");
      }

      if (!role2 || typeof role2 !== "string") {
        throw new HttpRequestError("Role2 is required and must be a string");
      }

      if (!noHp || typeof noHp !== "string") {
        throw new HttpRequestError("No HP is required and must be a string");
      }

      const topikDetail = await Topic.createTopikDetail(req.body, req.params.topikId, req.user.id);
      res.status(201).json(topikDetail);
    } catch (error) {
      if (error instanceof HttpRequestError) {
        console.log(error);
        return res.status(400).json({
          status: "Failed",
          message: error && error.message,
        });
      }
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }

  async getRole(req, res) {
    try {
      const roles = await Topic.getRole(req.params.id);
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }
  async getPendaftarTopic(req, res) {
    try {
      const { nama } = req.query;
      console.log(nama);
      if (!nama === "") {
        const pendaftar = await Topic.getPendaftarTopic(userId);

        res.status(200).json({
          status: "Success",
          message: "Pendaftar topic berhasil diambil",
          data: pendaftar,
        });
      }

      const data = await Topic.getPendaftarTopicFilter(nama);
      res.status(200).json({
        status: "Success",
        message: "Pendaftar topic berhasil diambil",
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: error,
      });
    }
  }

  async updatePendaftarTopic(req, res) {
    try {
      const {role1} = req.body;
      const pendaftar = await Topic.updatePendaftarTopic(req.params.id, role1);
      
      const hapus = await Topic.deleteTopicLain(pendaftar.user_id);
      console.log(hapus);

      res.status(201).json({
        status: "Success",
        message: "Pendaftar topic berhasil diupdate",
        data: pendaftar,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }
  async deletePendaftarTopic(req, res) {
    try {
      const pendaftar = await Topic.deletePendaftarTopic(req.params.id);
      res.status(200).json({
        status: "Success",
        message: "Pendaftar topic berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }
  async getPendaftarTopicAcc(req, res) {
    try {
      const { nama } = req.query;
      if (nama === "") {
        const pendaftar = await Topic.getPendaftarTopicAcc();

        res.status(200).json({
          status: "Success",
          message: "Pendaftar topic berhasil diambil",
          data: pendaftar,
        });
      }
      const data = await Topic.getPendaftarTopicAccFilter(nama);
      res.status(200).json({
        status: "Success",
        message: "Pendaftar topic berhasil diambil",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }
  async updateTopic(req, res) {
    try {
      const { nama, deskripsi, roles } = req.body;
      if (!nama || typeof nama !== "string") {
        throw new HttpRequestError("Nama is required and must be a string");
      }

      if (!deskripsi || typeof deskripsi !== "string") {
        throw new HttpRequestError("Deskripsi is required and must be a string");
      }

      const topic = await Topic.updateTopic(req.params.id, req.body, req.user.id);
      res.status(200).json(topic);
    } catch (error) {
      if (error.message === "topic not found or unauthorized") {
        return res.status(404).json({ message: error.message });
      }
      console.log(error);
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  }
  async getRole(req, res) {
    try {
      const id = req.params.id;
      const role = await Topic.getRole(id);
      return res.status(200).json({
        status: "Success",
        message: "Role berhasil diambil",
        data: role,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message && "Internal server error" });
    }
  }
}

module.exports = new TopicController();
