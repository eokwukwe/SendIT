import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
} = process.env;

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
});

pool.on('connect', () => {
  console.log('connected to db');
});

/**
 * Create Users Table
 */
const createUsersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
    users(
      id SERIAL PRIMARY KEY NOT NULL,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email VARCHAR(128) UNIQUE NOT NULL,
      password VARCHAR(128) NOT NULL,
      usertype VARCHAR(10) NOT NULL DEFAULT 'user',
      created_on TIMESTAMP NOT NULL DEFAULT now(),
      updated_on TIMESTAMP NOT NULL DEFAULT now(),
      lastLogin TIMESTAMP DEFAULT now()
    )`;

  pool
    .query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

module.exports = {
  createUsersTable
};

require('make-runnable');
