const { Employee } = require('../models');

const employeeController = {
  // Get all employees
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.findAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get employee by ID
  getEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (employee) {
        res.json(employee);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new employee
  createEmployee: async (req, res) => {
    try {
      const employee = await Employee.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update employee
  updateEmployee: async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (employee) {
        await employee.update(req.body);
        res.json(employee);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete employee
  deleteEmployee: async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (employee) {
        await employee.destroy();
        res.json({ message: 'Employee deleted' });
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = employeeController;
