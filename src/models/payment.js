'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Payment extends Model {}
  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'customers',
          key: 'id',
        },
      },
      employee_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'employees',
          key: 'id',
        },
      },
      total_price: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Payment;
};
