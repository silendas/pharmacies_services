'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      kode_struk: {
        type: Sequelize.STRING,
      },
      customer_id: {
        type: Sequelize.INTEGER,  // Harus sama dengan tipe data id di customers
        allowNull: true,
        references: {
          model: 'customers',  // Nama tabel yang direferensikan
          key: 'id'            // Kolom yang dijadikan referensi
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      employee_id: {
        type: Sequelize.INTEGER,  // Harus sama dengan tipe data id di employees
        allowNull: false,
        references: {
          model: 'employees',  // Nama tabel yang direferensikan
          key: 'id'            // Kolom yang dijadikan referensi
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('payments');
  }
};
