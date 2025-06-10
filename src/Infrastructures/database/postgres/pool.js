/* istanbul ignore file */

const process = require('node:process');
const { Pool } = require('pg');

const testConfig = {
  host: String(process.env.PGHOST_TEST),
  port: Number(process.env.PGPORT_TEST),
  user: String(process.env.PGUSER_TEST),
  password: String(process.env.PGPASSWORD_TEST),
  database: String(process.env.PGDATABASE_TEST),
};

const pool =
  process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();

module.exports = pool;
