'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date();

    try {
      // Dapatkan ID role
      const [roles] = await queryInterface.sequelize.query(
        `SELECT id, name FROM roles WHERE name IN ('administrator', 'kasir', 'apoteker')`
      );

      // Dapatkan ID employee
      const [employees] = await queryInterface.sequelize.query(
        `SELECT id, nik FROM employees WHERE nik IN ('0001', '0002', '0003')`
      );

      // Buat mapping untuk role dan employee
      const roleMap = roles.reduce((acc, role) => {
        acc[role.name] = role.id;
        return acc;
      }, {});

      const employeeMap = employees.reduce((acc, emp) => {
        acc[emp.nik] = emp.id;
        return acc;
      }, {});

      // Insert users
      await queryInterface.bulkInsert('users', [
        {
          employee_id: employeeMap['0001'],
          role_id: roleMap['administrator'],
          username: 'admin',
          password: await bcrypt.hash('admin123', 8),
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          employee_id: employeeMap['0002'],
          role_id: roleMap['kasir'],
          username: 'kasir',
          password: await bcrypt.hash('kasir123', 8),
          created_at: timestamp,
          updated_at: timestamp
        },
        {
          employee_id: employeeMap['0003'],
          role_id: roleMap['apoteker'],
          username: 'apoteker',
          password: await bcrypt.hash('apoteker123', 8),
          created_at: timestamp,
          updated_at: timestamp
        }
      ]);

    } catch (error) {
      console.error('Seeder Error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('users', {
        username: {
          [Sequelize.Op.in]: ['admin', 'kasir', 'apoteker']
        }
      });
    } catch (error) {
      console.error('Seeder Undo Error:', error);
      throw error;
    }
  }
}; 