import expect from 'expect';
import request from 'supertest';
import { describe, it } from 'mocha';

import app from '../server';

describe('GET all parcel delivery order', () => {
	it('should return all parcel delivery orders', done => {
		request(app)
			.get('/api/v1/parcels')
			.expect(200)
			.expect(res => {
				expect(res.body.status).toEqual('success');
				expect(res.body.message).toEqual('Available orders');
				expect(typeof res.body).toBe('object');
				expect(res.body.orders.length).toBeGreaterThan(0);
			})
			.end(done);
	});
});

describe('GET a specific parcel delivery order', () => {
	const parcelId = 2;
	it('should return a specific parcel order with the given ID', done => {
		request(app)
			.get(`/api/v1/parcels/${parcelId}`)
			.expect(200)
			.expect(res => {
				expect(res.body.status).toEqual('success');
				expect(res.body.message).toEqual('Your order');
				expect(typeof res.body).toBe('object');
			})
			.end(done);
	});

	it('should return 404 if the ID does match any parcel ID', done => {
		request(app)
			.get(`/api/v1/parcels/${6}`)
			.expect(404)
			.expect(res => {
				expect(res.body.status).toEqual('error');
				expect(res.body.error).toEqual('order not found');
			})
			.end(done);
	});
});

describe('GET parcel delivery orders by a specific user', () => {
	const userId = 2;
	it('should return parcel delivery orders by a specific user', done => {
		request(app)
			.get(`/api/v1/users/${userId}/parcels`)
			.expect(200)
			.expect(res => {
				expect(res.body.status).toEqual('success');
				expect(res.body.message).toEqual(`orders by ${userId}`);
			})
			.end(done);
	});

	it('should return 404 if the ID does match any user ID', done => {
		request(app)
			.get(`/api/v1/users/${8}/parcels`)
			.expect(404)
			.expect(res => {
				expect(res.body.status).toEqual('error');
				expect(res.body.error).toEqual('user does not have any orders yet');
			})
			.end(done);
	});
});

describe('POST a parcel delivery order', () => {
	const order = {
		receiverName: 'susan rice',
		receiverEmail: 'susan.rice@gmail.com',
		receiverPhone: '08085651245',
		parcelName: 'Travel documents',
		parcelWeight: 0.1,
		orderPrice: 111,
		address: '12 ololo street omomo',
		city: 'lagos',
		country: 'nigeria'
	};

	it('should return 201 when an order is created successfully', done => {
		request(app)
			.post('/api/v1/parcels')
			.send(order)
			.expect(201)
			.expect(res => {
				expect(res.body.status).toEqual('success');
				expect(res.body.message).toEqual(
					'Parcel delivery order created successully'
				);
			})
			.end(done);
	});

	it('should return 400 when the order detail is empty', done => {
		request(app)
			.post('/api/v1/parcels')
			.send({})
			.expect(400)
			.expect(res => {
				expect(res.body.error).toEqual('order detail cannot be empty');
			})
			.end(done);
	});

	it('should return 400 if the receiver name is empty or invalid', done => {
		order.receiverName = '';
		request(app)
			.post('/api/v1/parcels')
			.send(order)
			.expect(400)
			.expect(res => {
				expect(res.body.error).toEqual('name cannot be empty');
			})
			.end(done);
	});

	it('should return 400 if the receiver email is invalid', done => {
		order.receiverName = 'susan rice';
		order.receiverEmail = 'okwuke.com';
		request(app)
			.post('/api/v1/parcels')
			.send(order)
			.expect(400)
			.expect(res => {
				expect(res.body.error).toEqual('email is invalid');
			})
			.end(done);
	});

	it('should return 400 if the receiver phone number is invalid', done => {
		order.receiverEmail = 'susan.rice@gmail.com';
		order.receiverPhone = '0002255888';
		request(app)
			.post('/api/v1/parcels')
			.send(order)
			.expect(400)
			.expect(res => {
				expect(res.body.error).toEqual('invalid phone number');
			})
			.end(done);
	});

	it('should return 400 if the parcel name is empty', done => {
		order.receiverPhone = '08072351454';
		order.parcelName = '';
		request(app)
			.post('/api/v1/parcels')
			.send(order)
			.expect(400)
			.expect(res => {
				expect(res.body.error).toEqual('parcel name cannot be empty');
			})
			.end(done);
	});

	it('should return 400 if the parcel weight is invalid or less than zero', done => {
		order.parcelName = 'shoes';
		order.parcelWeight = 0;
		request(app)
			.post('/api/v1/parcels')
			.send(order)
			.expect(400)
			.expect(res => {
				expect(res.body.error).toEqual(
					'invalid input. The weight cannot be empty and must be greater than zero'
				);
			})
			.end(done);
	});

	it('should return 400 if the parcel weight is invalid or less than zero', done => {
		order.parcelWeight = 2;
		order.orderPrice = '';
		request(app)
			.post('/api/v1/parcels')
			.send(order)
			.expect(400)
			.expect(res => {
				expect(res.body.error).toEqual(
					'invalid input. The price cannot be empty and must be greater than one'
				);
			})
			.end(done);
	});

	it('should return 400 if the address is empty', done => {
		order.orderPrice = 125;
		order.address = '';
		request(app)
			.post('/api/v1/parcels')
			.send(order)
			.expect(400)
			.expect(res => {
				expect(res.body.error).toEqual('address cannot be empty');
			})
			.end(done);
	});
	it('should return 400 if the city is empty', done => {
		order.address = 'ojata';
		order.city = '';
		request(app)
			.post('/api/v1/parcels')
			.send(order)
			.expect(400)
			.expect(res => {
				expect(res.body.error).toEqual('city cannot be empty');
			})
			.end(done);
	});

	it('should return 400 if the country is empty', done => {
		order.city = 'lagos';
		order.country = '';
		request(app)
			.post('/api/v1/parcels')
			.send(order)
			.expect(400)
			.expect(res => {
				expect(res.body.error).toEqual('country cannot be empty');
			})
			.end(done);
	});
});

describe('PUT a parcel delivery order', () => {
	it('should return 400 if the request is empty', done => {
		const parcelId = 2;
		request(app)
			.put(`/api/v1/parcels/${parcelId}/cancel`)
			.send({})
			.expect(400)
			.expect(res => {
				expect(res.body.status).toEqual('error');
				expect(res.body.error).toEqual('no cancell request sent');
			})
			.end(done);
	});

	it('should return 404 if the order does not exist', done => {
		const parcelId = 5;
		request(app)
			.put(`/api/v1/parcels/${parcelId}/cancel`)
			.send({ cancelled: 'true' })
			.expect(404)
			.expect(res => {
				expect(res.body.status).toEqual('error');
				expect(res.body.error).toEqual('order not found');
			})
			.end(done);
	});

	it('should return 400 if the order is already cancelled', done => {
		const parcelId = 4;
		request(app)
			.put(`/api/v1/parcels/${parcelId}/cancel`)
			.send({ cancelled: 'true' })
			.expect(400)
			.expect(res => {
				expect(res.body.status).toEqual('error');
				expect(res.body.error).toEqual(
					`parcel order #${parcelId} is already cancelled`
				);
			})
			.end(done);
	});

	it('should return 201 when the order is cancelled successfully', done => {
		const parcelId = 2;
		request(app)
			.put(`/api/v1/parcels/${parcelId}/cancel`)
			.send({ cancelled: 'true' })
			.expect(201)
			.expect(res => {
				expect(res.body.status).toEqual('success');
				expect(res.body.message).toEqual(
					`Parcel delivery order #${parcelId} cancelled successully`
				);
			})
			.end(done);
	});

	it('should change cancelled to true', done => {
		const parcelId = 2;
		request(app)
			.put(`/api/v1/parcels/${parcelId}/cancel`)
			.send({ cancelled: 'true' })
			.expect(201)
			.expect(res => {
				expect(res.body.status).toEqual('success');
				expect(res.body.order.cancelled).toBe('true');
			})
			.end(done);
	});
});
