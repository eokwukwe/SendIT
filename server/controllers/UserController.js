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
    const errorsMsg = {};
    errors.array().forEach((error) => {
      errorsMsg[error.param] = error.msg;
    });
    if (!errors.isEmpty()) {
      return res.status(400).json(errorsMsg);
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
        id, firstname, lastname, usertype
      } = rows[0];
      const payload = {
        userId: id,
        usertype,
        lastname,
        firstname
      };
      const token = Helper.generateToken(payload);

      return res.status(201).json({
        message: 'You have successfully signed up',
        token
      });
    } catch (err) {
      if (err.routine === '_bt_check_unique') {
        return res.status(400).json({
          message: 'A user with that email already exists'
        });
      }
      return res.status(500).json({
        error: 'signup unsuccessful'
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
    const errorsMsg = {};
    errors.array().forEach((error) => {
      errorsMsg[error.param] = error.msg;
    });
    if (!errors.isEmpty()) {
      return res.status(400).json(errorsMsg);
    }
    const { userEmail, password } = req.body;
    const queryText = 'SELECT * FROM users WHERE email = $1';

    try {
      const { rows } = await db.query(queryText, [userEmail]);
      if (!rows[0]) {
        return res.status(400).json({
          message: 'User does not exist'
        });
      }
      if (!Helper.comparePassword(rows[0].password, password)) {
        return res.status(400).json({
          message: 'Incorrect password'
        });
      }
      const {
        id, usertype, firstname, lastname
      } = rows[0];
      const payload = {
        userId: id,
        usertype,
        firstname,
        lastname
      };
      const token = Helper.generateToken(payload);
      return res.status(200).json({
        message: 'You have successfully log in',
        token
      });
    } catch (err) {
      return res.status(500).json({
        error: 'cannot login'
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
    const queryText = 'SELECT * FROM users WHERE usertype=$1';
    try {
      const { rows, rowCount } = await db.query(queryText, ['user']);
      if (rows.length === 0) {
        return res.status(404).json({
          message: 'users not found'
        });
      }
      const users = [];
      rows.forEach((row) => {
        const {
          id, firstname, lastname, email
        } = row;
        const user = {
          id,
          firstname,
          lastname,
          email
        };
        users.push(user);
      });

      return res.status(200).json({
        users,
        totalUsers: rowCount
      });
    } catch (err) {
      return res.status(500).json({
        error: 'could not get the users'
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
    const queryText = 'SELECT * FROM users WHERE id=$1 AND usertype=$2';
    try {
      const { rows } = await db.query(queryText, [userId, 'user']);
      const {
        id, firstname, lastname, email
      } = rows[0];
      const user = {
        id,
        firstname,
        lastname,
        email
      };
      if (!rows[0]) {
        return res.status(404).json({
          message: 'user not found'
        });
      }
      return res.status(200).json({
        user
      });
    } catch (err) {
      return res.status(500).json({
        error: 'could not get user'
      });
    }
  }
}
