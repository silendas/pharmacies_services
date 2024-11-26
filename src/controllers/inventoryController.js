const { Inventory, Employee } = require('../models');

const inventoryController = {
  getAllInventories: async (req, res) => {
    try {
      const inventories = await Inventory.findAll({
        include: [
          {
            model: Employee,
            as: 'created_by_employee',
            attributes: ['id', 'name']
          },
          {
            model: Employee,
            as: 'updated_by_employee',
            attributes: ['id', 'name']
          }
        ]
      });
      res.json(inventories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getInventoryById: async (req, res) => {
    try {
      const inventory = await Inventory.findByPk(req.params.id, {
        include: [
          {
            model: Employee,
            as: 'created_by_employee',
            attributes: ['id', 'name']
          },
          {
            model: Employee,
            as: 'updated_by_employee',
            attributes: ['id', 'name']
          }
        ]
      });
      if (inventory) {
        res.json(inventory);
      } else {
        res.status(404).json({ message: 'Inventori tidak ditemukan' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createInventory: async (req, res) => {
    try {
      const inventory = await Inventory.create(req.body);
      res.status(201).json(inventory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateInventory: async (req, res) => {
    try {
      const inventory = await Inventory.findByPk(req.params.id);
      if (inventory) {
        await inventory.update(req.body);
        res.json(inventory);
      } else {
        res.status(404).json({ message: 'Inventory not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteInventory: async (req, res) => {
    try {
      const inventory = await Inventory.findByPk(req.params.id);
      if (inventory) {
        await inventory.destroy();
        res.json({ message: 'Inventory deleted' });
      } else {
        res.status(404).json({ message: 'Inventory not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = inventoryController;
