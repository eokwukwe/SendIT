import moment from 'moment';
import { validationResult } from 'express-validator/check';
import sendNotification from '../mailer/sendMail';

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
   *  @static
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

  /**
   * @static
   * @desc GET /api/v1/auth/forgotPassword
   * @param {object} req
   * @param {object} res
   * @returns password reset token
   * @memberof UserController
   */
  static async forgotPassword(req, res) {
    const errors = validationResult(req);
    const errorsMsg = {};
    errors.array().forEach((error) => {
      errorsMsg[error.param] = error.msg;
    });
    if (!errors.isEmpty()) {
      return res.status(400).json(errorsMsg);
    }
    const { userEmail } = req.body;
    const findText = 'SELECT * FROM users WHERE email = $1';
    const updateText = 'UPDATE users SET reset_password_token=$1, reset_password_expires=$2 WHERE email=$3 returning firstname';
    const resetToken = await Helper.generatePasswordResetToken();
    try {
      const { rows } = await db.query(findText, [userEmail]);
      if (!rows[0]) {
        return res.status(404).json({
          message: 'User does not exist'
        });
      }
      const values = [resetToken, moment(new Date(Date.now() + 3600000)), userEmail];
      const result = await db.query(updateText, values);
      const to = rows[0].email;
      const user = result.rows[0].firstname;
      const subject = 'Password reset request';
      const message = `
        <h3 style="text-transform:capitalize">Hello ${user},</h3>
        <p>
          You are receiving this email because you (or someone else) have requested 
          the reset of the password for your account.
        </p>
        <p>
          Please click on the following link, or paste this into your browser to complete the process:
        </p>
        <p>
          ${req.protocol}://${req.headers.host}/resetPassword/${resetToken}
        </p>
        <p>
          If you did not request this, please ignore this email and your password will remain unchanged.
        </p>
        <br><br>
        <h4>From the SendIT Team</h4>
        <p>senditparcels2018@gmail.com</p>
      `;
      sendNotification(to, subject, message);
      return res.status(200).json({
        message: 'Please check your mail for further instructions to reset your password'
      });
    } catch (err) {
      return res.status(500).json({
        error: 'Could not process with the request. Try again later',
        err
      });
    }
  }

  /**
   * The returned timestamp from the database is less that the stored
   * timestamp by 3600000 sec (1 hr), so that amount is added to the
   * resetTimestamp variable to make it equal to the stored timestamp
   * for accurate comparism between the current time and the time for
   * the token to expires which is 1hr (3600000 sec) from the time of
   * password reset token creation.
   * @static
   * @desc GET /api/v1/auth/resetPassword/:resetToken
   * @param {object} req
   * @param {object} res
   * @returns new password
   * @memberof UserController
   */
  static async resetPassword(req, res) {
    const errors = validationResult(req);
    const errorsMsg = {};
    errors.array().forEach((error) => {
      errorsMsg[error.param] = error.msg;
    });
    if (!errors.isEmpty()) {
      return res.status(400).json(errorsMsg);
    }
    const { resetToken } = req.params;
    const { password } = req.body;
    const newPassword = Helper.hashPassword(password);
    const findText = 'SELECT * FROM users WHERE reset_password_token = $1';
    const updateText = 'UPDATE users SET password=$1, reset_password_token=$2, reset_password_expires=$3, updated_on=$4 WHERE email=$5 returning firstname';
    try {
      const { rows } = await db.query(findText, [resetToken]);
      if (!rows[0]) {
        return res.status(404).json({
          message: 'Password reset token is invalid'
        });
      }
      const resetTimestamp = Date.parse(rows[0].reset_password_expires) + 3600000;
      const currentTime = Date.now();
      if (currentTime > resetTimestamp) {
        return res.status(400).json({
          message: 'Password reset token has expired. Please send a new reset request'
        });
      }
      const values = [newPassword, null, null, moment(new Date()), rows[0].email];
      const result = await db.query(updateText, values);
      const to = rows[0].email;
      const user = result.rows[0].firstname;
      const subject = 'Password reset notification';
      const message = `
        <h3 style="text-transform:capitalize">Hello ${user},</h3>
        <p>
          This is a confirmation that the password for your account ${to} has just been changed.
        </p>
        <p>
          if you did not initiate the password, please contact us ASAP at senditparcels2018@gmail.com
        </p>
        <br><br>
        <h4>From the SendIT Team</h4>
        <p>senditparcels2018@gmail.com</p>
      `;
      sendNotification(to, subject, message);
      return res.status(200).json({
        message: 'You have successfully change your password'
      });
    } catch (err) {
      return res.status(500).json({
        error: 'Could not process with the request. Try again later',
        err
      });
    }
  }
}
