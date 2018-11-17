import { orders } from '../model/orders';
import { validationResult } from 'express-validator/check';

export default class ParcelOrders {
	/**
	 * @desc GET api/v1/parcels
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} all orders
	 * @memberof ParcelOrders
	 */
	static getAllOrders(req, res) {
		if (orders.length === 0) {
			return res.status(404).json({
				status: 'error',
				error: 'No orders found',
				orders
			});
		}
		res.status(200).json({
			status: 'success',
			message: 'Available orders',
			orders
		});
	}

	/**
	 * @desc GET api/v1/parcels/:parcelId
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} one order
	 * @memberof ParcelOrders
	 */
	static getOneOrder(req, res) {
		const parcelId = parseInt(req.params.parcelId, 0);
		const parcelOrder = orders.filter(order => parcelId === order.parcelId)[0];

		if (!parcelOrder) {
			return res.status(404).json({
				status: 'error',
				error: 'order not found'
			});
		}

		res.status(200).json({
			status: 'success',
			message: 'Your order',
			order: parcelOrder
		});
	}

	/**
	 * @desc GET api/v1/users/:userId/parcels
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} user orders
	 * @memberof ParcelOrders
	 */
	static getOrdersbyUser(req, res) {
		const userId = parseInt(req.params.userId, 0);
		const userOrders = orders.filter(order => userId === order.userId);

		if (userOrders.length === 0) {
			return res.status(404).json({
				status: 'error',
				error: 'user does not have any orders yet'
			});
		}

		res.status(200).json({
			status: 'success',
			message: `orders by ${userId}`,
			userOrders
		});
	}

	/**
	 * @desc POST api/v1/parcels
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} created order
	 * @memberof ParcelOrders
	 */
	static createOrder(req, res) {
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

		const createdOrder = {
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
		};

		const errors = validationResult(req);

		orders.push(createdOrder);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		res.status(201).json({
			status: 'success',
			message: 'Parcel delivery order created successully',
			data: createdOrder
		});
	}

	/**
	 * @desc PUT api/v1/parcels/:parcelId/cancel
	 * @param {object} req
	 * @param {object} res
	 * @returns {object} cancelled order
	 * @memberof ParcelOrders
	 */
	static cancelOrder(req, res) {
		const { cancelled } = req.body;
		const parcelId = parseInt(req.params.parcelId, 0);
		const orderToCancel = orders.filter(
			order => parcelId === order.parcelId
		)[0];

		if (Object.keys(req.body).length === 0) {
			return res.status(400).json({
				status: 'error',
				error: 'no cancell request sent'
			});
		}

		if (!orderToCancel) {
			return res.status(404).json({
				status: 'error',
				error: 'order not found'
			});
		}

		if (orderToCancel.cancelled === true) {
			return res.status(400).json({
				status: 'error',
				error: `parcel order #${parcelId} is already cancelled`
			});
		}

		orderToCancel.cancelled = cancelled;

		res.status(200).json({
			status: 'success',
			message: `Parcel delivery order #${parcelId} cancelled successully`,
			order: orderToCancel
		});
	}
}
