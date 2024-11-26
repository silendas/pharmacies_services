'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Customer extends Model {}
  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nik: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'Customer',
      tableName: 'customers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Customer;
};
