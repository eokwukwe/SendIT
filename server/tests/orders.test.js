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
      parcelWeight: 1.2,
      fromAddress: '12 mango, Lagos lagos',
      fromCity: 'lagos',
      fromCountry: 'nigeria',
      toAddress: '67 olorufumi street',
      toCity: 'lagos',
      toCountry: 'nigeria',
      receiver: 'mane',
      receiverPhone: '07061234562'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('The description is too short');
      })
      .end(done);
  });

  it('should return 400 if the parcel weight is invalid', (done) => {
    order = {
      parcelDescription: '12 mando road, owowo',
      fromAddress: '12 mango, Lagos lagos',
      fromCity: 'lagos',
      fromCountry: 'nigeria',
      toAddress: '67 olorufumi street',
      toCity: 'lagos',
      toCountry: 'nigeria',
      receiver: 'mane',
      receiverPhone: '07061234562'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('weight must be decimal value');
      })
      .end(done);
  });

  it('should return 400 if fromAddress is invalid', (done) => {
    order = {
      parcelDescription: '12 mando road, owowo',
      parcelWeight: 1.2,
      fromCity: 'lagos',
      fromCountry: 'nigeria',
      toAddress: '67 olorufumi street',
      toCity: 'lagos',
      toCountry: 'nigeria',
      receiver: 'mane',
      receiverPhone: '07061234562'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('address is too short');
      })
      .end(done);
  });

  it('should return 400 if fromCity is invalid', (done) => {
    order = {
      parcelDescription: '12 mando road, owowo',
      parcelWeight: 1.2,
      fromAddress: '12 mango, Lagos lagos',
      fromCountry: 'nigeria',
      toAddress: '67 olorufumi street',
      toCity: 'lagos',
      toCountry: 'nigeria',
      receiver: 'mane',
      receiverPhone: '07061234562'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('City name is too short');
      })
      .end(done);
  });

  it('should return 400 if fromCountry is invalid', (done) => {
    order = {
      parcelDescription: '12 mando road, owowo',
      parcelWeight: 1.2,
      fromAddress: '12 mango, Lagos lagos',
      fromCity: 'lagos',
      toAddress: '67 olorufumi street',
      toCity: 'lagos',
      toCountry: 'nigeria',
      receiver: 'mane',
      receiverPhone: '07061234562'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('country name is too short');
      })
      .end(done);
  });

  it('should return 400 if toAddress is invalid', (done) => {
    order = {
      parcelDescription: '12 mando road, owowo',
      parcelWeight: 1.2,
      fromAddress: '12 mango, Lagos lagos',
      fromCity: 'lagos',
      fromCountry: 'nigeria',
      toCity: 'lagos',
      toCountry: 'nigeria',
      receiver: 'mane',
      receiverPhone: '07061234562'
    };
    request(app)
      .post('/api/v1/parcels')
      .send(order)
      .set({ Authorization: token })
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('address is too short');
      })
      .end(done);
  });
});
