import { orders } from '../model/orders';

export default class ParcelOrders {
	/**
	 * @desc A method for Get all parcel delivery orders
	 * @route  GET api/v1/orders
	 * @params {object} req
	 * @params {object} res
	 */
	getAllOrders(req, res) {
		if (!orders) {
			return res.status(404).json({
				Failure: true,
				Message: 'No orders found'
			});
		}
		res.json({
			Success: true,
			Message: 'Your orders',
			orders: orders
		});
	}

	/**
	 * @desc A method for Get specific parcel delivery order
	 * @route  GET api/v1/orders/:parcelId
	 * @params {object} req
	 * @params {object} res
	 */
	getOneOrder(req, res) {
		const parcelId = parseInt(req.params.parcelId, 0);
		const parcelOrder = orders.filter(order => parcelId === order.parcelId)[0];

		if (!parcelOrder) {
			return res.status(404).json({
				Message: 'order not found'
			});
		}

		res.status(201).json({
			Success: true,
			Message: 'Your order',
			order: parcelOrder
		});
	}

	/**
	 * @desc A method for Post parcel delivery order
	 * @route  POST api/v1/orders
	 * @params {object} req
	 * @params {object} res
	 */
	createOrder(req, res) {
		const createdOrder = {
			receiverName: req.body.receiverName,
			receiverEmail: req.body.receiverEmail,
			receiverPhone: req.body.receiverPhone,
			parcelId: req.body.parcelId,
			parcelName: req.body.parcelName,
			parcelWeight: req.body.parcelWeight,
			orderPrice: req.body.orderPrice,
			address: req.body.address,
			city: req.body.city,
			country: req.body.country,
			delivered: req.body.delivered,
			inTransit: req.body.inTransit,
			cancelled: req.body.cancelled
		};

		orders.push(createdOrder);

		res.status(201).json({
			Success: true,
			Message: 'Parcel delivery order created successully',
			data: createdOrder,
			orders: orders
		});
	}
}
