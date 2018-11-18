import moment from 'moment';
import { validationResult } from 'express-validator/check';

import db from '../model';
import Helper from './helper';

export default class User {
	/**
	 * @static
	 * @desc POST /api/v1/auth/signup
	 * @param {object} req
	 * @param {object} res
	 * @returns user token
	 * @memberof User
	 */
	static async create(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const { firstname, lastname, email, password } = req.body;
		const hassPassword = Helper.hashPassword(password);
		const queryText =
			'INSERT INTO users(firstname, lastname, email, password, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6) returning *';

		const values = [
			firstname,
			lastname,
			email,
			hassPassword,
			moment(new Date()),
			moment(new Date())
		];

		try {
			const { rows } = await db.query(queryText, values);
			const { id, usertype, firstname, lastname } = rows[0];
			const token = Helper.generateToken(id, usertype);

			return res.status(201).json({
				status: 'signup success',
				message: 'you have successfully signed up',
				token: token,
				details: {
					firstname,
					lastname
				}
			});
		} catch (error) {
			if (error.routine === '_bt_check_unique') {
				return res.status(400).json({
					status: 'signup failure',
					message: 'user with that email already exists'
				});
			}
			return res.status(400).json({
				status: 'signup failure',
				message: 'signup unsuccessful',
				error: error
			});
		}
	}

	/**
	 * @static
	 * @desc POST /api/v1/auth/login
	 * @param {object} req
	 * @param {object} res
	 * @returns user token
	 * @memberof User
	 */
	static async login(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const { email, password } = req.body;
		const queryText = 'SELECT * FROM users WHERE email = $1';

		try {
			const { rows } = await db.query(queryText, [email]);
			if (!rows[0]) {
				return res.status(400).json({
					status: 'login failure',
					message: 'user does not exist'
				});
			}
			if (!Helper.comparePassword(rows[0].password, password)) {
				return res.status(400).json({
					status: 'login failure',
					message: 'incorrect password'
				});
			}

			const { id, usertype } = rows[0];
			const token = Helper.generateToken(id, usertype);
			return res.status(200).json({
				status: 'login success',
				message: 'you have successfully log in',
				token: token
			});
		} catch (error) {
			return res.status(400).json({
				status: 'login failure',
				error: error
			});
		}
	}
}
