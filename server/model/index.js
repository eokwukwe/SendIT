import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

const pool = new Pool({
	host: DB_HOST,
	port: DB_PORT,
	user: DB_USER,
	password: DB_PASS,
	database: DB_NAME
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
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
};
