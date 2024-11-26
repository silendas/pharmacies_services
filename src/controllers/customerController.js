const { Customer } = require('../models');

const customerController = {
  // Get all customers
  getAllCustomers: async (req, res) => {
    try {
      const customers = await Customer.findAll();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get customer by ID
  getCustomerById: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (customer) {
        res.json(customer);
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new customer
  createCustomer: async (req, res) => {
    try {
      const customer = await Customer.create(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update customer
  updateCustomer: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (customer) {
        await customer.update(req.body);
        res.json(customer);
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete customer
  deleteCustomer: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (customer) {
        await customer.destroy();
        res.json({ message: 'Customer deleted' });
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = customerController;
