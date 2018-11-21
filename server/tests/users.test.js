import expect from 'expect';
import request from 'supertest';
import { describe, it, after } from 'mocha';
import db from '../model';

import app from '../server';

describe('TEST for users endpoint', () => {
  const user = {
    fname: 'mary',
    lname: 'kay',
    email: 'mary.kay@test.com',
    password: 'mary.Kay',
    confirmPassword: 'mary.Kay'
  };

  const cleanUp = async () => {
    await db.query('DELETE FROM users WHERE email=$1', [user.email]);
  };

  after(cleanUp);

  it('should create a new user', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toEqual('signup success');
        expect(res.body.message).toEqual('you have successfully signed up');
      })
      .end(done);
  });

  it('should return 400 if the firstname is invalid', (done) => {
    const user1 = {
      fname: 'ma',
      lname: 'kay',
      email: 'marked.kay@test.com',
      password: 'mary.Kay',
      confirmPassword: 'mary.Kay'
    };
    request(app)
      .post('/api/v1/auth/signup')
      .send(user1)
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('name must be at least 3 chars long');
      })
      .end(done);
  });

  it('should return 400 if the lastname is invalid', (done) => {
    const user2 = {
      fname: 'mary',
      lname: 'ka',
      email: 'marked.kay@test.com',
      password: 'mary.Kay',
      confirmPassword: 'mary.Kay'
    };
    request(app)
      .post('/api/v1/auth/signup')
      .send(user2)
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('name must be at least 3 chars long');
      })
      .end(done);
  });

  it('should return 400 if the email is invalid', (done) => {
    const user3 = {
      fname: 'mary',
      lname: 'kay',
      email: 'marked.kaytest.com',
      password: 'mary.Kay',
      confirmPassword: 'mary.Kay'
    };
    request(app)
      .post('/api/v1/auth/signup')
      .send(user3)
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('invalid email');
      })
      .end(done);
  });

  it('should return 400 if the password is invalid', (done) => {
    const user4 = {
      fname: 'mary',
      lname: 'kay',
      email: 'marked.kay@test.com',
      password: 'maay',
      confirmPassword: 'maryay'
    };
    request(app)
      .post('/api/v1/auth/signup')
      .send(user4)
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('Password must be at least 6 characters in length.');
      })
      .end(done);
  });

  it('should return 400 if the passwords does not match', (done) => {
    const user5 = {
      fname: 'mary',
      lname: 'kay',
      email: 'marked.kay@test.com',
      password: 'mar.Yay',
      confirmPassword: 'mar.Jay'
    };
    request(app)
      .post('/api/v1/auth/signup')
      .send(user5)
      .expect(400)
      .expect((res) => {
        expect(res.body[0].msg).toEqual('Passwords does not match.');
      })
      .end(done);
  });

  it('should return 400 if email is already taken', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .expect(400)
      .expect((res) => {
        expect(res.body.status).toEqual('signup failure');
        expect(res.body.message).toEqual('user with that email already exists');
      })
      .end(done);
  });

  it('should login users', (done) => {
    const userDetail = {
      email: 'mary.kay@test.com',
      password: 'mary.Kay'
    };
    request(app)
      .post('/api/v1/auth/login')
      .send(userDetail)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toEqual('you have successfully log in');
        expect(res.body.status).toEqual('login success');
      })
      .end(done);
  });

  it('should return 400 if the user does not exist', (done) => {
    const userDetail = {
      email: 'mary.ay@test.com',
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
      email: 'mary.kay@test.com',
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
