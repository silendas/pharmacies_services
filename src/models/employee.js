'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Employee extends Model {}
  Employee.init(
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
      position: {
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
      modelName: 'Employee',
      tableName: 'employees',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Employee;
};
