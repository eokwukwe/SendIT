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
      firstName, lastName, userEmail, password
    } = req.body;
    const hassPassword = Helper.hashPassword(password);
    const queryText = 'INSERT INTO users(firstname, lastname, email, password, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6) returning *';

    const values = [
      firstName,
      lastName,
      userEmail,
      hassPassword,
      moment(new Date()),
      moment(new Date())
    ];

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
      return res.status(500).json({
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

    const { userEmail, password } = req.body;
    const queryText = 'SELECT * FROM users WHERE email = $1';

    try {
      const { rows } = await db.query(queryText, [userEmail]);
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
      return res.status(500).json({
        status: 'error',
        err
      });
    }
  }

  /**
   * @static
   * @desc GET /api/v1/users
   * @param {object} req
   * @param {object} res
   * @returns all users
   * @memberof UserController
   */
  static async getAllUsers(req, res) {
    const queryText = 'SELECT * FROM users WHERE usertype=$1 returning firstname, lastname, email';
    try {
      const { rows, rowCount } = await db.query(queryText, ['user']);
      if (rows.length === 0) {
        return res.status(404).json({
          status: 'failure',
          message: 'users not found'
        });
      }
      return res.status(200).json({
        status: 'success',
        message: 'available users',
        rows,
        total: rowCount
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        error: 'could not get the orders'
      });
    }
  }

  /**
   * @desc GET api/v1/users/:userId
   * @param {object} req
   * @param {object} res
   * @returns {object} one user
   * @memberof UserController
   */
  static async getOneUser(req, res) {
    const userId = parseInt(req.params.userId, 0);
    const queryText = 'SELECT * FROM users WHERE id=$1 returning firstname, lastname, email';
    try {
      const { rows } = await db.query(queryText, [userId]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 'failure',
          message: 'user not found'
        });
      }
      return res.status(200).json({
        status: 'success',
        message: 'user orders found',
        user: rows[0]
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        error: 'could not get user'
      });
    }
  }
}
