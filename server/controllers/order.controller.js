import moment from 'moment';
import { validationResult } from 'express-validator/check';

import db from '../model';

export default class Order {
	/**
	 * @desc POST api/v1/parcels
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} created order
	 * @memberof Order
	 */
	static async createOrder(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const {
			parcelDescription,
			parcelWeight,
			fromAddress,
			fromCity,
			fromCountry,
			toAddress,
			toCity,
			toCountry,
			receiver,
			receiverPhone
		} = req.body;

		const orderPrice = parcelWeight * 150;
		const userId = parseInt(req.user.id, 0);
		const presentLocation = fromAddress;
		const queryText = `INSERT INTO 
			orders(parcel_descript, parcel_wgt, price, from_address, from_city, from_country, to_address, to_city, to_country, receiver, receiver_phone, present_location, userid, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning *`;

		const values = [
			parcelDescription,
			parcelWeight,
			orderPrice,
			fromAddress,
			fromCity,
			fromCountry,
			toAddress,
			toCity,
			toCountry,
			receiver,
			receiverPhone,
			presentLocation,
			userId,
			moment(new Date()),
			moment(new Date())
		];

		try {
			const { rows } = await db.query(queryText, values);
			return res.status(201).json({
				status: 'success',
				message: 'parcel delivery order created successully',
				order: rows[0]
			});
		} catch (error) {
			return res.status(400).json({
				status: 'error',
				message: 'order not created',
				error: error
			});
		}
	}

	/**
	 * @desc GET api/v1/parcels
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} all orders
	 * @memberof Order
	 */
	static async getAllOrders(req, res) {
		const queryText = 'SELECT * FROM orders';
		try {
			const { rows, rowCount } = await db.query(queryText);
			if (rows.length === 0) {
				return res.status(404).json({
					status: 'failure',
					message: 'orders not found'
				});
			}
			return res.status(200).json({
				status: 'success',
				message: 'available orders',
				rows,
				total: rowCount
			});
		} catch (error) {
			return res.status(400).json({
				status: 'error',
				message: 'could not get the orders'
			});
		}
	}

	/**
	 * @desc GET api/v1/parcels/:parcelId
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} one order
	 * @memberof Order
	 */
	static async getOneOrder(req, res) {
		const parcelId = parseInt(req.params.parcelId, 0);
		const queryText = 'SELECT * FROM orders WHERE id=$1';
		try {
			const { rows } = await db.query(queryText, [parcelId]);
			if (!rows[0]) {
				return res.status(404).json({
					status: 'failure',
					message: 'user orders not found'
				});
			}
			return res.status(200).json({
				status: 'success',
				message: 'user orders found',
				order: rows[0]
			});
		} catch (error) {
			return res.status(400).json({
				status: 'error',
				message: 'could not get user orders'
			});
		}
	}

	/**
	 * @desc GET api/v1/users/:userId/parcels
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} user orders
	 * @memberof Order
	 */
	static async getOrdersbyUser(req, res) {
		const userId = parseInt(req.params.userId, 0);
		const queryText = 'SELECT * FROM orders WHERE userid=$1';
		try {
			const { rows, rowCount } = await db.query(queryText, [userId]);
			if (rows.length === 0) {
				return res.status(404).json({
					status: 'failure',
					error: 'user orders not found'
				});
			}
			return res.status(200).json({
				status: 'success',
				message: 'user orders',
				rows,
				total: rowCount
			});
		} catch (error) {
			return res.status(400).json({
				status: 'error',
				message: 'could not get the order'
			});
		}
	}

	/**
	 * @desc PUT api/v1/parcels/:parcelId/cancel
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} cancelled order
	 * @memberof Order
	 */
	static async cancelOrder(req, res) {
		const { status, userId } = req.body;
		const parcelId = parseInt(req.params.parcelId, 0);
		const findText = 'SELECT * FROM order WHERE id=$1 AND userid=$2';
		const updateText =
			'UPDATE orders SET status=$1, updated_on=$2 WHERE id=$3 AND userid=$4 returning *';

		try {
			const { rows } = await db.query(findText, [parcelId, userId]);
			if (!rows[0]) {
				return res.status(404).json({
					status: 'failure',
					message: 'order not found'
				});
			}
			const values = [
				status || rows[0].status,
				moment(new Date()),
				parcelId,
				userId
			];
			const result = await db.query(updateText, values);
			return res.status(200).json({
				status: 'success',
				message: 'order cancelled',
				order: result.rows[0]
			});
		} catch (error) {
			return res.status(400).json({
				status: 'error',
				message: 'could not cancell order'
			});
		}
	}

	/**
	 * @desc PUT api/v1/parcels/:parcelId/destination
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} changed destination order
	 * @memberof Order
	 */
	static async changeOrderDestination(req, res) {
		const { toAddress, toCity, toCountry, userId } = req.body;
		const parcelId = parseInt(req.params.parcelId, 0);
		const findText = 'SELECT * FROM order WHERE id=$1 AND userid=$2';
		const updateText =
			'UPDATE orders SET to_address=$1, to_city=$2, to_country=$3, updated_on=$4 WHERE id=$5 AND userid=$6 returning *';
		try {
			const { rows } = await db.query(findText, [parcelId, userId]);
			if (!rows[0]) {
				return res.status(404).json({
					status: 'failure',
					message: 'order not found'
				});
			}
			const values = [
				toAddress || rows[0].to_address,
				toCity || rows[0].to_city,
				toCountry || rows[0].to_country,
				moment(new Date()),
				parcelId,
				userId
			];
			const result = await db.query(updateText, values);
			return res.status(200).json({
				status: 'success',
				message: 'order destination changed',
				order: result.rows[0]
			});
		} catch (error) {
			return res.status(400).json({
				status: 'error',
				message: 'could not change order destination'
			});
		}
	}
}
