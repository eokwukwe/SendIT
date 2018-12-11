import { Pool } from 'pg';
import moment from 'moment';
import dotenv from 'dotenv';
import Helper from '../helper/helper';

dotenv.config();
const adminPassword = process.env.ADMIN_PASS;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
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
      reset_password_token VARCHAR,
      reset_password_expires DATE,
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

const insertAdmin = () => {
  const password = Helper.hashPassword(adminPassword);
  const queryText = `INSERT INTO 
    users(firstname, lastname, email, password, usertype, created_on, updated_on) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
  const values = [
    'admin',
    'sendit',
    'admin@sendit.com',
    password,
    'admin',
    moment(new Date()),
    moment(new Date())
  ];
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
      weight REAL NOT NULL,
      price REAL NOT NULL,
      distance REAL,
      description VARCHAR NOT NULL,
      pickup VARCHAR NOT NULL,
      destination VARCHAR NOT NULL,
      location VARCHAR,
      receiver_name VARCHAR NOT NULL,
      receiver_phone VARCHAR(11) NOT NULL,
      cancelled BOOL DEFAULT 'false',
      status VARCHAR DEFAULT 'pending',
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
  insertAdmin();
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
  insertAdmin
};

require('make-runnable');
