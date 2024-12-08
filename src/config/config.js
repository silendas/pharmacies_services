'use strict';

const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();


const pool = new Pool({
  user: process.env.POSTGRES_USER, 
  host: process.env.POSTGRES_HOST,
  database: 'db_pharmacy',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

module.exports = pool;
