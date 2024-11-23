const { Cart } = require('../models');

const cartController = {
  // Mendapatkan semua data cart
  async getAll(req, res) {
    try {
      const carts = await Cart.findAll();
      res.status(200).json(carts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch carts' });
    }
  },

  // Mendapatkan cart berdasarkan ID
  async getById(req, res) {
    try {
      const cart = await Cart.findByPk(req.params.id);
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  },

  // Menambahkan item ke cart
  async create(req, res) {
    try {
      const { customer_id, inventory_id, quantity } = req.body;
      const newCart = await Cart.create({ customer_id, inventory_id, quantity });
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  },

  // Memperbarui item dalam cart
  async update(req, res) {
    try {
      const { quantity } = req.body;
      const cart = await Cart.findByPk(req.params.id);
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      cart.quantity = quantity || cart.quantity;
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update cart' });
    }
  },

  // Menghapus item dari cart
  async delete(req, res) {
    try {
      const cart = await Cart.findByPk(req.params.id);
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      await cart.destroy();
      res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete cart item' });
    }
  },
};

module.exports = cartController;
