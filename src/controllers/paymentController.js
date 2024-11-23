const { Payment } = require('../models');

module.exports = {
  async createPayment(req, res) {
    try {
      const payment = await Payment.create(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllPayments(req, res) {
    try {
      const payments = await Payment.findAll();
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
