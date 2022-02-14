const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');

const app = require('../config/app');
// const { User } = require('../models');

const {
  DB_USER_TEST,
  DB_PASS_TEST,
  DB_CLUSTER_TEST,
  DB_NAME_TEST,
} = process.env;

const DB_URI = `mongodb+srv://${DB_USER_TEST}:${DB_PASS_TEST}@${DB_CLUSTER_TEST}.mongodb.net/${DB_NAME_TEST}?retryWrites=true&w=majority`;

const goodUser = {
  email: 'goodUser@email.com',
  password: 'useruser123',
};
const badUser = {
  email: 'badUser@email.com',
  password: 'useruser123',
};

describe('POST /register', () => {
  before(async () => {
    await mongoose.connect(DB_URI);
    // await User.collection.drop();
    const collections = await mongoose.connection.db.collections();
    collections.forEach(async (collection) => {
      await collection.drop();
    });
  });

  it('Email required!', async () => {
    const response = await request(app)
      .post('/register')
      .send({})
      .expect(422);
    expect(response.body.message).to.equal('"email" is required');
  });
  it('Password required!', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: badUser.email })
      .expect(422);
    expect(response.body.message).to.equal('"password" is required');
  });
  it('Create new User.', async () => {
    const response = await request(app)
      .post('/register')
      .send(goodUser)
      .expect(200);
    expect(response.body.message).to.equal('User was created successfully.');
  });
  it('Do not create User with same credentials.', async () => {
    const response = await request(app)
      .post('/register')
      .send(goodUser)
      .expect(409);
    expect(response.body.message).to.equal('User already exists with this email.');
  });
});

describe('POST /login', () => {
  let cookie;
  after(async () => {
    await mongoose.disconnect();
  });

  it('Email required!', async () => {
    const response = await request(app)
      .post('/login')
      .send({})
      .expect(422);
    expect(response.body.message).to.equal('Unable to login.');
  });
  it('Password required!', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: badUser.email })
      .expect(422);
    expect(response.body.message).to.equal('Unable to login.');
  });
  it('Login with incorrect credentials.', async () => {
    const response = await request(app)
      .post('/login')
      .send(badUser)
      .expect(422);
    expect(response.body.message).to.equal('Unable to login.');
  });
  it('Login with correct credentials (get tokens).', async () => {
    const response = await request(app)
      .post('/login')
      .send(goodUser)
      .expect(200);
    expect(response.body).to.have.property('token');
    cookie = JSON.stringify(response.headers['set-cookie'][0]).split(';')[0].replace('"', '');
  });
  it('Refresh access token.', async () => {
    const response = await request(app)
      .post('/refresh')
      .set('Cookie', cookie)
      .expect(200);
    expect(response.body).to.have.property('token');
    __log.info(cookie);
  });
});
