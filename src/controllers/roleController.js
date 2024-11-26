const { Role } = require('../models');

const roleController = {
  getAllRoles: async (req, res) => {
    try {
      const roles = await Role.findAll();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getRoleById: async (req, res) => {
    try {
      const role = await Role.findByPk(req.params.id);
      if (role) {
        res.json(role);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createRole: async (req, res) => {
    try {
      const role = await Role.create(req.body);
      res.status(201).json(role);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateRole: async (req, res) => {
    try {
      const role = await Role.findByPk(req.params.id);
      if (role) {
        await role.update(req.body);
        res.json(role);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteRole: async (req, res) => {
    try {
      const role = await Role.findByPk(req.params.id);
      if (role) {
        await role.destroy();
        res.json({ message: 'Role deleted' });
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = roleController;
