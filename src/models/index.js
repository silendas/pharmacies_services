'use strict';

const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js');

// Inisialisasi koneksi database
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect
  }
);

// Import semua model
const Customer = require('./customer')(sequelize);
const Employee = require('./employee')(sequelize);
const User = require('./user')(sequelize);
const Role = require('./role')(sequelize);
const Payment = require('./payment')(sequelize);
const Cart = require('./cart')(sequelize);
const Salary = require('./salary')(sequelize);
const Inventory = require('./inventory')(sequelize);

// Definisi relasi antar model
User.belongsTo(Employee, { foreignKey: 'employee_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// Relasi Payment
Payment.belongsTo(Customer, { foreignKey: 'customer_id' });
Payment.belongsTo(Employee, { foreignKey: 'employee_id' });
Payment.hasMany(Cart, { foreignKey: 'payment_id', as: 'carts' });

// Relasi Cart
Cart.belongsTo(Payment, { foreignKey: 'payment_id' });
Cart.belongsTo(Inventory, { foreignKey: 'inventory_id' });

// Relasi Salary
Salary.belongsTo(Employee, { foreignKey: 'employee_id' });

// Definisi soft delete untuk model yang memiliki kolom deleted
const softDeleteModels = [Inventory];
softDeleteModels.forEach(model => {
  model.addHook('beforeFind', (options) => {
    options.where = {
      ...options.where,
      deleted: false
    };
  });
});

// Export semua model
module.exports = {
  sequelize,
  Sequelize,
  Customer,
  Employee,
  User,
  Role,
  Payment,
  Cart,
  Salary,
  Inventory
};
