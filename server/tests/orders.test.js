import expect from 'expect';
import request from 'supertest';
import { describe, it } from 'mocha';

import Helper from '../helper/helper';
// import db from '../model';
import app from '../server';

describe('TEST for orders endpoint', () => {
  let order = {};
  const payload = { userId: 5, usertype: 'user', email: 'john@doe.com' };
  const token = Helper.generateToken(payload);
  it('should return 400 if the parcel description is invalid', (done) => {
    order = {
      weight: 1.2,
      pickup: '12 mango, Lagos lagos',
      destination: '67 olorufumi street, lagos',
      receiver: 'mane',
      phone: '07061234562'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body.description).toEqual('Invalid value');
      })
      .end(done);
  });

  it('should return 400 if the parcel weight is invalid', (done) => {
    order = {
      description: '12 mando road, owowo',
      pickup: '12 mango, Lagos lagos',
      destination: '67 olorufumi street',
      receiver: 'mane',
      phone: '07061234562'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body.weight).toEqual('weight must be decimal value');
      })
      .end(done);
  });

  it('should return 400 if pickup address is invalid', (done) => {
    order = {
      description: '12 mando road, owowo',
      weight: 1.2,
      destination: '67 olorufumi street',
      receiver: 'mane',
      phone: '07061234562'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body.pickup).toEqual('invalid input, please enter a valid address');
      })
      .end(done);
  });

  it('should return 400 if destination is invalid', (done) => {
    order = {
      description: '12 mando road, owowo',
      weight: 1.2,
      pickup: '12 mango, Lagos lagos',
      receiver: 'mane',
      phone: '07061234562'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body.destination).toEqual('invalid input, please enter a valid address');
      })
      .end(done);
  });

  it('should return 400 if phone number is invalid', (done) => {
    order = {
      description: '12 mando road, owowo',
      weight: 1.2,
      pickup: '12 mango, Lagos lagos',
      receiver: 'mane',
      destination: '67 olorufumi street'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body.phone).toEqual('invalid receiver phone number');
      })
      .end(done);
  });
});
