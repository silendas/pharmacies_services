const { Payment, Employee, Customer, Cart, Inventory } = require('../models');

const paymentController = {
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll({
        include: [
          {
            model: Employee,
            attributes: ['id', 'name', 'phone', 'address']
          },
          {
            model: Customer,
            attributes: ['id', 'name', 'phone', 'address']
          },
          {
            model: Cart,
            as: 'carts',
            include: [{
              model: Inventory,
              attributes: ['id', 'name', 'price', 'stock']
            }]
          }
        ]
      });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPaymentById: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [
          {
            model: Employee,
            attributes: ['id', 'name', 'phone', 'address']
          },
          {
            model: Customer,
            attributes: ['id', 'name', 'phone', 'address']
          },
          {
            model: Cart,
            as: 'carts',
            include: [{
              model: Inventory,
              attributes: ['id', 'name', 'price', 'stock']
            }]
          }
        ]
      });
      if (payment) {
        res.json(payment);
      } else {
        res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
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
