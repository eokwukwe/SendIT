import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

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
      last_login TIMESTAMP DEFAULT now()
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

/**
 * Create Parcels Order Table
 */
const createOrdersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
    orders(
      id SERIAL PRIMARY KEY NOT NULL,
      parcel_descrpt VARCHAR(100) NOT NULL,
      parcel_wgt REAL NOT NULL,
      price REAL NOT NULL,
      from_address VARCHAR(100) NOT NULL,
      from_city VARCHAR(100) NOT NULL,
      from_country VARCHAR(100) NOT NULL,
      to_address VARCHAR(100) NOT NULL,
      to_city VARCHAR(100) NOT NULL,
      to_country VARCHAR(100) NOT NULL,
      receiver VARCHAR(100) NOT NULL,
      receiver_phone VARCHAR(11) NOT NULL,
      cancelled BOOL DEFAULT 'false',
      present_location VARCHAR(100),
      status CHAR(10) DEFAULT 'pending',
      userid INT NOT NULL,
      created_on TIMESTAMP NOT NULL default now(),
      updated_on TIMESTAMP NOT NULL default now(),
      FOREIGN KEY (userid) REFERENCES users (id)
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

/**
 * Drop Users Table
 */
const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users returning *';
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
/**
 * Drop Orders Table
 */
const dropOrdersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users orders *';
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

/**
 * Create All Tables
 */
const createAllTables = () => {
  createUsersTable();
  createOrdersTable();
};
/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropUsersTable();
  dropOrdersTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createUsersTable,
  createOrdersTable,
  dropOrdersTable,
  dropUsersTable,
  createAllTables,
  dropAllTables
};

require('make-runnable');
