import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default class Auth {
	/**
	 * Verify Admin Token
	 * @param {object} req
	 * @param {object} res
	 * @param {object} next
	 * @returns {object|void} response object
	 */
	static async verifyAdminToken(req, res, next) {
		const token = req.headers['x-access-token'];
		if (!token) {
			return res
				.status(401)
				.json({ message: 'Not authenticated, please sign in' });
		}
		try {
			const decoded = await jwt.verify(token, process.env.JWT_SECRET);
			if (process.env.ADMIN_TYPE !== decoded.usertype) {
				return res.status(401).json({
					message: 'access denied! you are not authorized to visit this page'
				});
			}
			req.user = decoded;
			next();
		} catch (error) {
			return res.status(401).json({
				status: 'auth error',
				message: error
			});
		}
	}

	/**
	 * Verify User Token
	 * @param {object} req
	 * @param {object} res
	 * @param {object} next
	 * @returns {object|void} response object
	 */
	static async verifyUserToken(req, res, next) {
		const token = req.headers['x-access-token'];
		if (!token) {
			return res
				.status(401)
				.json({ message: 'Not authenticated, please sign in' });
		}
		try {
			const decoded = await jwt.verify(token, process.env.JWT_SECRET);
			if (process.env.USER_TYPE !== decoded.usertype) {
				return res.status(401).json({
					message: 'access denied! you are not authorized to visit this page'
				});
			}
			req.user = decoded;
			next();
		} catch (error) {
			return res.status(401).json({
				status: 'auth error',
				message: error
			});
		}
	}
}
