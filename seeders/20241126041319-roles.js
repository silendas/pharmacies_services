'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};