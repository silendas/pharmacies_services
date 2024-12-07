'use strict';

const dotenv = require('dotenv');

dotenv.config();

const config = {
  db: {
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
  port: process.env.PORT,
};

module.exports = config;