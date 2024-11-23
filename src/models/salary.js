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
        references: {
          model: 'employees',
          key: 'id',
        },
        allowNull: false,
      },
      basic_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      allowance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      deduction: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      total_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0, // Bisa dihitung secara otomatis dalam controller
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

  // Mengatur hook untuk menghitung total_salary sebelum penyimpanan
  Salary.beforeSave((salary) => {
    salary.total_salary =
      parseFloat(salary.basic_salary) +
      parseFloat(salary.allowance || 0) -
      parseFloat(salary.deduction || 0);
  });

  return Salary;
};
