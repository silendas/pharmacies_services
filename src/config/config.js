'use strict';

const dotenv = require('dotenv');

dotenv.config();

const config = {
  db: {
    database: process.env.POSTGRES_DATABASE, // Nama database
    username: process.env.POSTGRES_USER, // Username database
    password: process.env.POSTGRES_PASSWORD, // Password database
    host: process.env.POSTGRES_HOST,         // Host database
    dialect: 'postgres',                // Dialek database
  },
  port: process.env.PORT,
};

module.exports = config;