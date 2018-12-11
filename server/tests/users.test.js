import expect from 'expect';
import request from 'supertest';
import { describe, it, after } from 'mocha';
import db from '../model';

import app from '../server';

describe('TEST for users endpoint', () => {
  const user = {
    firstName: 'mary',
    lastName: 'kay',
    userEmail: 'mary.kay@test.com',
    password: 'mary.Kay1'
  };

  const cleanUp = async () => {
    await db.query('DELETE FROM users WHERE email=$1', [user.userEmail]);
  };

  after(cleanUp);

  it('should create a new user', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toEqual('you have successfully signed up');
      })
      .end(done);
  });

  it('should return 400 if the firstname is invalid', (done) => {
    const user1 = {
      firstName: 'm',
      lastName: 'kay',
      userEmail: 'marked.kay@test.com',
      password: 'mary.Kay1'
    };
    request(app)
      .post('/api/v1/auth/signup')
      .send(user1)
      .expect(400)
      .expect((res) => {
        expect(res.body.firstName).toEqual('firstname is too short');
      })
      .end(done);
  });

  it('should return 400 if the lastname is invalid', (done) => {
    const user2 = {
      firstName: 'mary',
      lastName: 'k',
      userEmail: 'marked.kay@test.com',
      password: 'mary.Kay1'
    };
    request(app)
      .post('/api/v1/auth/signup')
      .send(user2)
      .expect(400)
      .expect((res) => {
        expect(res.body.lastName).toEqual('lastname is too short');
      })
      .end(done);
  });

  it('should return 400 if the email is invalid', (done) => {
    const user3 = {
      firstName: 'mary',
      lastName: 'kay',
      userEmail: 'marked.kaytest.com',
      password: 'mary.Kay1'
    };
    request(app)
      .post('/api/v1/auth/signup')
      .send(user3)
      .expect(400)
      .expect((res) => {
        expect(res.body.userEmail).toEqual('invalid email');
      })
      .end(done);
  });

  it('should return 400 if the password is invalid', (done) => {
    const user4 = {
      firstName: 'mary',
      lastName: 'kay',
      userEmail: 'marked.kay@test.com',
      password: 'maay'
    };
    request(app)
      .post('/api/v1/auth/signup')
      .send(user4)
      .expect(400)
      .expect((res) => {
        expect(res.body.password).toEqual(
          'password must be at least 6 characters with at least 1 uppercase, 1 lowercase & 1 special character'
        );
      })
      .end(done);
  });

  it('should return 400 if email is already taken', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('user with that email already exists');
      })
      .end(done);
  });

  it('should login users', (done) => {
    const userDetail = {
      userEmail: 'mary.kay@test.com',
      password: 'mary.Kay1'
    };
    request(app)
      .post('/api/v1/auth/login')
      .send(userDetail)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toEqual('you have successfully log in');
      })
      .end(done);
  });

  it('should return 400 if the user does not exist', (done) => {
    const userDetail = {
      userEmail: 'mary.ay@test.com',
      password: 'mary.Kay'
    };
    request(app)
      .post('/api/v1/auth/login')
      .send(userDetail)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('user does not exist');
      })
      .end(done);
  });

  it('should return 400 if the password is not correct', (done) => {
    const userDetail = {
      userEmail: 'mary.kay@test.com',
      password: 'mary.ay'
    };
    request(app)
      .post('/api/v1/auth/login')
      .send(userDetail)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('incorrect password');
      })
      .end(done);
  });
});
