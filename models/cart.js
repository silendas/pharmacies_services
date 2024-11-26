'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cart extends Model {}
  Cart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      payment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'payments',
          key: 'id',
        },
      },
      inventory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'inventories',
          key: 'id',
        },
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'carts',
      timestamps: false,
    }
  );
  return Cart;
}; 