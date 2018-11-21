import moment from 'moment';
import { validationResult } from 'express-validator/check';

import db from '../model';
import Helper from '../helper/helper';

/** Users Controller Class */
export default class UserController {
  /**
   * @static
   * @desc POST /api/v1/auth/signup
   * @param {object} req
   * @param {object} res
   * @returns user token
   * @memberof UserController
   */
  static async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const {
      fname, lname, eml, password
    } = req.body;
    const hassPassword = Helper.hashPassword(password);
    const queryText = 'INSERT INTO users(firstname, lastname, email, password, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6) returning *';

    const values = [fname, lname, eml, hassPassword, moment(new Date()), moment(new Date())];

    try {
      const { rows } = await db.query(queryText, values);
      const {
        id, firstname, lastname, email, usertype
      } = rows[0];
      const payload = { userId: id, usertype, email };
      const token = Helper.generateToken(payload);

      return res.status(201).json({
        status: 'signup success',
        message: 'you have successfully signed up',
        token,
        details: {
          firstname,
          lastname
        }
      });
    } catch (err) {
      if (err.routine === '_bt_check_unique') {
        return res.status(400).json({
          status: 'signup failure',
          message: 'user with that email already exists'
        });
      }
      return res.status(400).json({
        status: 'error',
        error: 'signup unsuccessful',
        err
      });
    }
  }

  /**
   * @static
   * @desc POST /api/v1/auth/login
   * @param {object} req
   * @param {object} res
   * @returns user token
   * @memberof UserController
   */
  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { eml, password } = req.body;
    const queryText = 'SELECT * FROM users WHERE email = $1';

    try {
      const { rows } = await db.query(queryText, [eml]);
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
      const { id, usertype, email } = rows[0];
      const payload = { userId: id, usertype, email };
      const token = Helper.generateToken(payload);
      return res.status(200).json({
        status: 'login success',
        message: 'you have successfully log in',
        token
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        err
      });
    }
  }
}
