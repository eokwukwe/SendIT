import expect from 'expect';
import request from 'supertest';
import { describe, it } from 'mocha';

import app from '../server';

describe('GET all parcel delivery order', () => {
	it('should return all parcel delivery orders', done => {
		request(app)
			.get('/api/v1/parcels')
			.expect(201)
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
			.expect(201)
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
			.expect(201)
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
