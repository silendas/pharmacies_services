'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    'Cart',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inventory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Virtual field untuk total_price
      total_price: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue('qty') * this.Inventory.price;
        },
      },
    },
    {
      tableName: 'carts',
      timestamps: true,
    }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.Inventory, {
      foreignKey: 'inventory_id',
      as: 'Inventory',
    });
  };

  return Cart;
};
