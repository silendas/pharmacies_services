const { Role } = require('../models');

module.exports = {
  async createRole(req, res) {
    try {
      const role = await Role.create(req.body);
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllRoles(req, res) {
    try {
      const roles = await Role.findAll();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
