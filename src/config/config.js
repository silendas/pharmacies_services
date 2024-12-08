'use strict';

const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();


const pool = new Pool({
  user: process.env.POSTGRES_USER, 
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
});

module.exports = pool;
