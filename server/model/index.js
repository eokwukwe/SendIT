import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// const databaseURL = process.env.NODE_ENV.trim() === 'development' || process.env.NODE_ENV.trim() === 'test'
//   ? process.env.DBASE_URL
//   : process.env.DB_URI;

// const pool = new Pool({
//   connectionString: databaseURL
// });

let connectionString;
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

export default {
  /**
   * DB Query
   * @param {string} text
   * @param {Array} params
   * @returns {object} object
   */
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool
        .query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};
