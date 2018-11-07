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
