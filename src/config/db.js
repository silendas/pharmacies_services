'use strict';

const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const pool = require('./config');

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_URL,
  {
    dialect: 'postgres',
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