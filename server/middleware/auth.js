import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/** Users Authentication  */
export default class Auth {
  /**
   * Verify Admin token
   * @static
   * @param {object} req -The request object
   * @param {object} res - The response object
   * @param {function} next
   * @returns
   * @memberof Auth
   */
  static async verifyAdminToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated, please sign in' });
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
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next
   * @returns {object|void} response object
   * @memberof Auth
   */
  static async verifyUserToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated, please sign in' });
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
