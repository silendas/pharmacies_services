'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Inventory extends Model {}
  Inventory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Inventory',
      tableName: 'inventories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  return Inventory;
}; 