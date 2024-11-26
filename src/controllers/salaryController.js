const { Salary, Employee } = require('../models');

const salaryController = {
  getAllSalaries: async (req, res) => {
    try {
      const salaries = await Salary.findAll({
        include: [
          {
            model: Employee,
            attributes: ['id', 'name', 'phone', 'address']
          }
        ]
      });
      res.json(salaries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSalaryById: async (req, res) => {
    try {
      const salary = await Salary.findByPk(req.params.id, {
        include: [
          {
            model: Employee,
            attributes: ['id', 'name', 'phone', 'address']
          }
        ]
      });
      if (salary) {
        res.json(salary);
      } else {
        res.status(404).json({ message: 'Gaji tidak ditemukan' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createSalary: async (req, res) => {
    try {
      const salary = await Salary.create(req.body);
      res.status(201).json(salary);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateSalary: async (req, res) => {
    try {
      const salary = await Salary.findByPk(req.params.id);
      if (salary) {
        await salary.update(req.body);
        res.json(salary);
      } else {
        res.status(404).json({ message: 'Salary not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteSalary: async (req, res) => {
    try {
      const salary = await Salary.findByPk(req.params.id);
      if (salary) {
        await salary.destroy();
        res.json({ message: 'Salary deleted' });
      } else {
        res.status(404).json({ message: 'Salary not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = salaryController; 