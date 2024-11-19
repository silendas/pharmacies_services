'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('carts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      payment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'payments',
          key: 'id'
        },
        allowNull: false
      },
      inventory_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'inventories',
          key: 'id'
        },
        allowNull: false
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('carts');
  }
};
