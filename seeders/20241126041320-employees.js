'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const timestamp = new Date();
      
      // Insert data baru
      await queryInterface.bulkInsert('employees', [
        {
          nik: '0001',
          name: 'Administrator',
          position: 'Administrator',
          phone: '081234567890',
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          nik: '0002',
          name: 'Kasir Satu',
          position: 'Kasir',
          phone: '081234567891',
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          nik: '0003',
          name: 'Apoteker Satu',
          position: 'Apoteker',
          phone: '081234567892',
          created_at: timestamp,
          updated_at: timestamp
        }
      ]);
    } catch (error) {
      console.error('Error seeding employees:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Hapus berdasarkan NIK yang spesifik
      await queryInterface.bulkDelete('employees', {
        nik: {
          [Sequelize.Op.in]: ['0001', '0002', '0003']
        }
      });
    } catch (error) {
      console.error('Error undoing employees seed:', error);
      throw error;
    }
  }
}; 