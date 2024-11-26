const { Payment } = require('../models');

const paymentController = {
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPaymentById: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (payment) {
        res.json(payment);
      } else {
        res.status(404).json({ message: 'Payment not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createPayment: async (req, res) => {
    try {
      const payment = await Payment.create(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updatePayment: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (payment) {
        await payment.update(req.body);
        res.json(payment);
      } else {
        res.status(404).json({ message: 'Payment not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deletePayment: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (payment) {
        await payment.destroy();
        res.json({ message: 'Payment deleted' });
      } else {
        res.status(404).json({ message: 'Payment not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = paymentController;
