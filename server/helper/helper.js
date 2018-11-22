import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

/** Util Class */
export default class Helper {
  /**
   *Hash Password Method
   * @static
   * @param {string} password
   * @returns {string} returns hashed password
   * @memberof Helper
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  /**
   * Compare Password Method
   * @static
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   * @memberof Helper
   */
  static comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  }

  /**
   * Generate Token
   * @static
   * @param {object} payload - User data
   * @returns {object} token
   * @memberof Helper
   */
  static generateToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7h' });
    return token;
  }
}
