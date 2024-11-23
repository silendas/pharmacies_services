const { Inventory } = require('../models');

// Controller untuk Inventory
const inventoryController = {
  // Mendapatkan semua data inventory
  async getAll(req, res) {
    try {
      const inventories = await Inventory.findAll();
      res.status(200).json(inventories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch inventories' });
    }
  },

  // Mendapatkan inventory berdasarkan ID
  async getById(req, res) {
    try {
      const inventory = await Inventory.findByPk(req.params.id);
      if (!inventory) {
        return res.status(404).json({ error: 'Inventory not found' });
      }
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  },

  // Menambahkan inventory baru
  async create(req, res) {
    try {
      const { name, description, stock, price } = req.body;
      const newInventory = await Inventory.create({ name, description, stock, price });
      res.status(201).json(newInventory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create inventory' });
    }
  },

  // Memperbarui inventory berdasarkan ID
  async update(req, res) {
    try {
      const { name, description, stock, price } = req.body;
      const inventory = await Inventory.findByPk(req.params.id);
      if (!inventory) {
        return res.status(404).json({ error: 'Inventory not found' });
      }
      inventory.name = name || inventory.name;
      inventory.description = description || inventory.description;
      inventory.stock = stock || inventory.stock;
      inventory.price = price || inventory.price;
      await inventory.save();
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update inventory' });
    }
  },

  // Menghapus inventory berdasarkan ID
  async delete(req, res) {
    try {
      const inventory = await Inventory.findByPk(req.params.id);
      if (!inventory) {
        return res.status(404).json({ error: 'Inventory not found' });
      }
      await inventory.destroy();
      res.status(200).json({ message: 'Inventory deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete inventory' });
    }
  },
};

module.exports = inventoryController;
