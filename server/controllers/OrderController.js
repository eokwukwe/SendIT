import moment from 'moment';
import { validationResult } from 'express-validator/check';
import sendNotification from '../mailer/sendMail';

import db from '../model';

/** Orders Controller Class */
export default class OrderController {
  /**
   * @desc POST api/v1/parcels
   * @param {object} req
   * @param {object} res
   * @returns {object} created order
   * @memberof OrderController
   */
  static async createOrder(req, res) {
    const errors = validationResult(req);
    const errorsMsg = {};
    errors.array().forEach((error) => {
      errorsMsg[error.param] = error.msg;
    });
    if (!errors.isEmpty()) {
      return res.status(400).json(errorsMsg);
    }

    const {
      weight, price, distance, description, pickup, destination, receiver, phone
    } = req.body;

    const userId = parseInt(req.user.userId, 0);
    const location = pickup;
    const queryText = `INSERT INTO 
      orders(weight, price, distance, description, pickup, destination, location, receiver_name, receiver_phone, userid, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *`;

    const values = [
      weight,
      price.trim(),
      distance.trim(),
      description,
      pickup,
      destination,
      location,
      receiver,
      phone,
      userId,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(queryText, values);
      return res.status(201).json({
        message: 'order created successully',
        order: rows[0]
      });
    } catch (err) {
      return res.status(500).json({
        error: 'can not create order',
        err,
        body: req.body
      });
    }
  }

  /**
   * @desc GET api/v1/parcels
   * @param {object} req
   * @param {object} res
   * @returns {object} all orders
   * @memberof OrderController
   */
  static async getAllOrders(req, res) {
    const queryText = 'SELECT * FROM orders';
    try {
      const { rows, rowCount } = await db.query(queryText);
      if (rows.length === 0) {
        return res.status(404).json({
          message: 'orders not found'
        });
      }
      return res.status(200).json({
        orders: rows,
        totalOrders: rowCount
      });
    } catch (err) {
      return res.status(500).json({
        error: 'could not get the orders'
      });
    }
  }

  /**
   * @desc GET api/v1/parcels/:parcelId
   * @param {object} req
   * @param {object} res
   * @returns {object} one order
   * @memberof OrderController
   */
  static async getOneOrder(req, res) {
    const parcelId = parseInt(req.params.parcelId, 0);
    const queryText = 'SELECT * FROM orders WHERE id=$1';
    try {
      const { rows } = await db.query(queryText, [parcelId]);
      if (!rows[0]) {
        return res.status(404).json({
          message: 'order not found'
        });
      }
      return res.status(200).json({
        order: rows[0]
      });
    } catch (err) {
      return res.status(500).json({
        error: 'could not get the order'
      });
    }
  }

  /**
   * @desc GET api/v1/users/:userId/parcels
   * @param {object} req
   * @param {object} res
   * @returns {object} user orders
   * @memberof OrderController
   */
  static async getOrdersbyUser(req, res) {
    const userId = parseInt(req.params.userId, 0);
    const queryText = 'SELECT * FROM orders WHERE userid=$1';
    try {
      const { rows, rowCount } = await db.query(queryText, [userId]);
      if (rows.length === 0) {
        return res.status(404).json({
          message: 'user orders not found'
        });
      }
      return res.status(200).json({
        userOrders: rows,
        total: rowCount
      });
    } catch (err) {
      return res.status(500).json({
        error: 'could not get user orders'
      });
    }
  }

  /**
   * @desc PUT api/v1/parcels/:parcelId/cancel
   * @param {object} req
   * @param {object} res
   * @returns {object} cancelled order
   * @memberof OrderController
   */
  static async cancelOrder(req, res) {
    const userId = parseInt(req.user.userId, 0);
    const parcelId = parseInt(req.params.parcelId, 0);
    const findText = 'SELECT * FROM orders WHERE id=$1 AND userid=$2';
    const updateText = 'UPDATE orders SET cancelled=$1, updated_on=$2 WHERE id=$3 AND userid=$4 returning *';

    try {
      const { rows } = await db.query(findText, [parcelId, userId]);
      if (!rows[0]) {
        return res.status(404).json({
          message: 'order not found'
        });
      }
      const values = ['true', moment(new Date()), parcelId, userId];
      const result = await db.query(updateText, values);
      return res.status(200).json({
        message: `order cancelled ${result.rows[0].cancelled}`
      });
    } catch (err) {
      return res.status(500).json({
        error: 'could not cancell order'
      });
    }
  }

  /**
   * @desc PUT api/v1/parcels/:parcelId/destination
   * @param {object} req
   * @param {object} res
   * @returns {object} changed destination order
   * @memberof OrderController
   */
  static async changeOrderDestination(req, res) {
    const errors = validationResult(req);
    const errorsMsg = {};
    errors.array().forEach((error) => {
      errorsMsg[error.param] = error.msg;
    });
    if (!errors.isEmpty()) {
      return res.status(400).json(errorsMsg);
    }
    const { destination } = req.body;
    const userId = parseInt(req.user.userId, 0);
    const parcelId = parseInt(req.params.parcelId, 0);
    const findText = 'SELECT * FROM orders WHERE id=$1';
    const updateText = 'UPDATE orders SET destination=$1, updated_on=$2 WHERE id=$3 AND userid=$4 returning *';
    try {
      const { rows } = await db.query(findText, [parcelId]);
      if (!rows[0]) {
        return res.status(404).json({
          message: 'order not found'
        });
      }
      const values = [destination || rows[0].destination, moment(new Date()), parcelId, userId];
      const result = await db.query(updateText, values);
      const newDestination = `${result.rows[0].destination}`;

      return res.status(200).json({
        message: `parcel destination changed successfully to ${newDestination}`
      });
    } catch (err) {
      return res.status(500).json({
        error: 'could not change order destination'
      });
    }
  }

  /**
   * @desc PUT api/v1/parcels/:parcelId/status
   * @param {object} req
   * @param {object} res
   * @returns {object} changed status order
   * @memberof OrderController
   */
  static async changeOrderStatus(req, res) {
    const { status } = req.body;
    const parcelId = parseInt(req.params.parcelId, 0);
    const findUser = 'SELECT * FROM users WHERE id=$1';
    const findText = 'SELECT * FROM orders WHERE id=$1';
    const updateText = 'UPDATE orders SET status=$1, updated_on=$2 WHERE id=$3 returning *';

    try {
      const { rows } = await db.query(findText, [parcelId]);
      if (!rows[0]) {
        return res.status(404).json({
          message: 'order not found'
        });
      }
      const values = [status.trim() || rows[0].status, moment(new Date()), parcelId];
      const result = await db.query(updateText, values);
      const userInfo = await db.query(findUser, [rows[0].userid]);
      const to = userInfo.rows[0].email;
      const subject = 'Notification on parcel status';
      const user = userInfo.rows[0].firstname;
      const message = `
        <h3 style="text-transform:capitalize">Hello ${user},</h3><p>Your parcel is ${result.rows[0].status.trim()}</p>`;

      sendNotification(to, subject, message);
      return res.status(200).json({
        message: `order status updated successfully to ${result.rows[0].status.trim()}`
      });
    } catch (err) {
      return res.status(500).json({
        error: 'could not update order status'
      });
    }
  }

  /**
   * @desc PUT api/v1/parcels/:parcelId/presentLocation
   * @param {object} req
   * @param {object} res
   * @returns {object} changed present location order
   * @memberof OrderController
   */
  static async changeOrderPresentLocation(req, res) {
    const errors = validationResult(req);
    const errorsMsg = {};
    errors.array().forEach((error) => {
      errorsMsg[error.param] = error.msg;
    });
    if (!errors.isEmpty()) {
      return res.status(400).json(errorsMsg);
    }

    const { location } = req.body;
    const parcelId = parseInt(req.params.parcelId, 0);
    const findUser = 'SELECT * FROM users WHERE id=$1';
    const findText = 'SELECT * FROM orders WHERE id=$1';
    const updateText = 'UPDATE orders SET location=$1, updated_on=$2 WHERE id=$3 returning *';

    try {
      const { rows } = await db.query(findText, [parcelId]);
      if (!rows[0]) {
        return res.status(404).json({
          message: 'order not found'
        });
      }

      const values = [location || rows[0].location, moment(new Date()), parcelId];
      const result = await db.query(updateText, values);
      const userInfo = await db.query(findUser, [rows[0].userid]);

      const to = userInfo.rows[0].email;
      const subject = 'Notification on parcel location';
      const user = userInfo.rows[0].firstname;
      const message = `
      <h3 style="text-transform:capitalize">Hello ${user},</h3>
      <p>Your parcel is currently at ${result.rows[0].location}</p>`;

      sendNotification(to, subject, message);

      return res.status(200).json({
        message: `present location successfully changed to ${result.rows[0].location}`
      });
    } catch (err) {
      return res.status(500).json({
        error: 'could not change order present location'
      });
    }
  }
}
