const HttpRequestError = require("../utils/error");
const Topic = require('../models/topic');
const TopicValidation = require('../validations/topic');


class TopicController {
    async createTopic(req, res) {
      try {
        const { nama, deskripsi } = req.body;
        if (!nama || typeof nama !== 'string') {
            throw new HttpRequestError('Nama is required and must be a string');
          }
          
          if (!deskripsi || typeof deskripsi !== 'string') {
            throw new HttpRequestError('Deskripsi is required and must be a string');
          }
        const topic = await Topic.createtopic(req.body, req.user.id);
        res.status(201).json(topic);
      } catch (error) {
        if (error instanceof HttpRequestError) {
          return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
      }
    }

    async getAllTopic(req, res) {
        try {
            const topics = await Topic.getAllTopic();
            res.status(200).json(topics);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getTopicById(req, res) {
        try {
          const topic = await Topic.getTopicById(req.params.id);
          if (!topic) {
            return res.status(404).json({ message: 'topic not found' });
          }
          res.status(200).json(topic);
        } catch (error) {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
  
    async deleteTopic(req, res) {
      try {
        await Topic.deletetopic(req.params.id, req.user.id);
        res.status(200).json({ message: 'topic deleted successfully' });
      } catch (error) {
        if (error.message === 'topic not found or unauthorized') {
          return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  
    async createTopikDetail(req, res) {
      try {
        validateTopikDetail(req.body);
        const topikDetail = await Topic.createTopikDetail(
          req.body,
          req.params.topikId,
          req.user.id
        );
        res.status(201).json(topikDetail);
      } catch (error) {
        if (error instanceof HttpRequestError) {
          return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
module.exports = new TopicController();