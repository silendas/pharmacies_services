const { Salaries } = require('../models');

const salariesController = {
  // Mendapatkan semua data gaji
  async getAll(req, res) {
    try {
      const salaries = await Salaries.findAll();
      res.status(200).json(salaries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch salaries' });
    }
  },

  // Mendapatkan data gaji berdasarkan ID
  async getById(req, res) {
    try {
      const salary = await Salaries.findByPk(req.params.id);
      if (!salary) {
        return res.status(404).json({ error: 'Salary record not found' });
      }
      res.status(200).json(salary);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch salary' });
    }
  },

  // Menambahkan data gaji
  async create(req, res) {
    try {
      const { employee_id, amount, month } = req.body;
      const newSalary = await Salaries.create({ employee_id, amount, month });
      res.status(201).json(newSalary);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add salary' });
    }
  },

  // Memperbarui data gaji berdasarkan ID
  async update(req, res) {
    try {
      const { amount, month } = req.body;
      const salary = await Salaries.findByPk(req.params.id);
      if (!salary) {
        return res.status(404).json({ error: 'Salary record not found' });
      }
      salary.amount = amount || salary.amount;
      salary.month = month || salary.month;
      await salary.save();
      res.status(200).json(salary);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update salary' });
    }
  },

  // Menghapus data gaji berdasarkan ID
  async delete(req, res) {
    try {
      const salary = await Salaries.findByPk(req.params.id);
      if (!salary) {
        return res.status(404).json({ error: 'Salary record not found' });
      }
      await salary.destroy();
      res.status(200).json({ message: 'Salary record deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete salary record' });
    }
  },
};

module.exports = salariesController;
