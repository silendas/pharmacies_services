const { Employee } = require('../models');

module.exports = {
  async createEmployee(req, res) {
    try {
      const employee = await Employee.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllEmployees(req, res) {
    try {
      const employees = await Employee.findAll();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
