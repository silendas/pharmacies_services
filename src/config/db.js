'use strict';

const { Sequelize } = require('sequelize');
const pool = require('./config');

const sequelize = new Sequelize(
  pool.database,
  pool.user,
  pool.db.password,
  {
    host: pool.host,
    dialect: 'postgres',
    port: 5432
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;