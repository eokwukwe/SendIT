import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

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
