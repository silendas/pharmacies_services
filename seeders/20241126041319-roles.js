'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'administrator',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'kasir',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'apoteker',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};