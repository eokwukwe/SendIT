import { orders } from '../model/orders';

export default class ParcelOrders {
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
