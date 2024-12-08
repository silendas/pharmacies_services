'use strict';

const { Sequelize } = require('sequelize');
const pool = require('./config');

const sequelize = new Sequelize(
  pool.database,
  pool.user,
  pool.password,
  {
    host: pool.host,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
);

sequelize.authenticate()
  .then(() => {
    console.log('Koneksi telah berhasil dibuat.');
  })
  .catch(err => {
    console.error('Tidak dapat terhubung ke basis data:', err);
  });

module.exports = sequelize;