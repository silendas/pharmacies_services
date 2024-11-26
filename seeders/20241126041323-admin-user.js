'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const timestamp = new Date();

    // Pertama, buat employee untuk admin
    const [employee] = await queryInterface.bulkInsert('employees', [{
      name: 'Administrator',
      phone: '081234567890',
      address: 'Alamat Administrator',
      created_at: timestamp,
      updated_at: timestamp
    }], { returning: true });

    // Dapatkan ID role administrator
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id from roles WHERE name = 'administrator'`
    );
    
    const adminRoleId = adminRole[0].id;

    // Buat user administrator
    await queryInterface.bulkInsert('users', [{
      employee_id: employee.id,
      role_id: adminRoleId,
      username: 'admin',
      password: await bcrypt.hash('admin123', 8),
      created_at: timestamp,
      updated_at: timestamp
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus user admin
    await queryInterface.bulkDelete('users', { 
      username: 'admin' 
    }, {});
    
    // Hapus employee admin
    await queryInterface.bulkDelete('employees', { 
      name: 'Administrator' 
    }, {});
  }
};
