import { orders } from '../model/orders';

export default class ParcelOrders {
	/**
	 * @desc A method to Get all parcel delivery orders
	 * @route  GET api/v1/parcels
	 * @params {object} req
	 * @params {object} res
	 */
	getAllOrders(req, res) {
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
	 * @desc A method to Get specific parcel delivery order
	 * @route  GET api/v1/parcels/:parcelId
	 * @params {object} req
	 * @params {object} res
	 */
	getOneOrder(req, res) {
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
	 * @desc A method to Get parcel delivery orders by a specific user
	 * @route  GET api/v1/users/:userId/parcels
	 * @params {object} req
	 * @params {object} res
	 */
	getOrdersbyUser(req, res) {
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
	 * @desc A method to Post parcel delivery order
	 * @route  POST api/v1/parcels
	 * @params {object} req
	 * @params {object} res
	 */
	createOrder(req, res) {
		const { receiverName, receiverEmail, receiverPhone, parcelId, parcelName, parcelWeight, orderPrice, address, city, country, delivered, inTransit, cancelled } = req.body;

		const createdOrder = {
			receiverName,
			receiverEmail,
			receiverPhone,
			parcelId,
			parcelName,
			parcelWeight,
			orderPrice,
			address,
			city,
			country,
			delivered,
			inTransit,
			cancelled
		};

		orders.push(createdOrder);

		res.status(201).json({
			status: 'success',
			message: 'Parcel delivery order created successully',
			data: createdOrder
		});
	}

	/**
	 * @desc A method to Cancel parcel delivery order
	 * @route  POST api/v1/parcels/:parcelId/cancel
	 * @params {object} req
	 * @params {object} res
	 */
	cancelOrder(req, res) {
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

		const cancelledOrder = Object.assign(orderToCancel, { cancelled });

		res.status(201).json({
			status: 'success',
			message: `Parcel delivery order #${parcelId} cancelled successully`,
			order: cancelledOrder
		});
	}
}
