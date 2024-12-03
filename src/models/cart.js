'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
          const qty = this.getDataValue('qty');
          const inventoryPrice = this.Inventory?.price || 0; // Cek nullish Inventory
          return qty * inventoryPrice;
        },
      },
    },
    {
      tableName: 'carts',
      timestamps: false,
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
