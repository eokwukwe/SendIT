import { Pool } from 'pg';
import dotenv from 'dotenv';
import Helper from '../helper/helper';

dotenv.config();
let connectionString;
const adminPassword = process.env.ADMIN_PASS;

switch (process.env.NODE_ENV) {
  case 'test' || 'development':
    connectionString = process.env.DATABASE_URL;
    break;
  default:
    connectionString = process.env.DATABASE_URL;
    break;
}
const pool = new Pool({
  connectionString
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

const insertUser = () => {
  const password = Helper.hashPassword(adminPassword);
  const queryText = `INSERT INTO 
    users(firstname, lastname, email, password, usertype) 
    VALUES ($1, $2, $3, $4, $5)`;
  const values = ['admin', 'sendit', 'admin@sendit.com', password, 'admin'];
  pool
    .query(queryText, values)
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
  const queryText = 'DROP TABLE IF EXISTS users';
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
  const queryText = 'DROP TABLE IF EXISTS orders';
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
  insertUser();
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
});

export {
  createUsersTable,
  createOrdersTable,
  dropOrdersTable,
  dropUsersTable,
  createAllTables,
  dropAllTables,
  insertUser
};

require('make-runnable');
