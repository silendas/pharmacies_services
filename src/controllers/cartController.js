const { Cart, Inventory, Payment } = require('../models');

const cartController = {
  getAllCarts: async (req, res) => {
    try {
      const carts = await Cart.findAll({
        include: [{
          model: Inventory,
          attributes: ['id', 'name', 'price', 'stock']
        }]
      });
      res.json(carts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCartById: async (req, res) => {
    try {
      const cart = await Cart.findByPk(req.params.id, {
        include: [{
          model: Inventory,
          attributes: ['id', 'name', 'price', 'stock']
        }]
      });
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ message: 'Keranjang tidak ditemukan' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCartsByPayment: async (req, res) => {
    try {
      const carts = await Cart.findAll({
        where: {
          payment_id: req.params.paymentId
        },
        include: [{
          model: Inventory,
          attributes: ['id', 'name', 'price', 'stock']
        }]
      });
      res.json(carts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createCart: async (req, res) => {
    try {
      const cart = await Cart.create(req.body);
      res.status(201).json(cart);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateCart: async (req, res) => {
    try {
      const cart = await Cart.findByPk(req.params.id);
      if (cart) {
        await cart.update(req.body);
        res.json(cart);
      } else {
        res.status(404).json({ message: 'Cart not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteCart: async (req, res) => {
    try {
      const cart = await Cart.findByPk(req.params.id);
      if (cart) {
        await cart.destroy();
        res.json({ message: 'Cart deleted' });
      } else {
        res.status(404).json({ message: 'Cart not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = cartController;
