'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const timestamp = new Date();
    await queryInterface.bulkInsert('roles', [
      {
        name: 'administrator',
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        name: 'kasir',
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        name: 'apoteker',
        created_at: timestamp,
        updated_at: timestamp
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', {
      name: {
        [Sequelize.Op.in]: ['administrator', 'kasir', 'apoteker']
      }
    }, {});
  }
};