'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Salary extends Model {}
  Salary.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id',
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      period: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Salary',
      tableName: 'salaries',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Salary;
}; 