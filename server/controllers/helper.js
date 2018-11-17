import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

export default class Helper {
	/**
	 * Hash Password Method
	 * @param {string} password
	 * @returns {string} returns hashed password
	 */
	static hashPassword(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	}
	/**
	 * Compare Password Method
	 * @param {string} hashPassword
	 * @param {string} password
	 * @returns {Boolean} return True or False
	 */
	static comparePassword(hashPassword, password) {
		return bcrypt.compareSync(password, hashPassword);
	}

	/**
	 * Gnerate Token
	 * @param {string} id
	 * @returns {string} token
	 */
	static generateToken(id, usertype) {
		const token = jwt.sign(
			{
				userId: id,
				usertype: usertype
			},
			process.env.JWT_SECRET,
			{ expiresIn: '7d' }
		);
		return token;
	}
}
