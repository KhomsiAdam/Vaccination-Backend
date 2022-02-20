const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');

const app = require('../config/app');

const {
  DB_USER_TEST,
  DB_PASS_TEST,
  DB_CLUSTER_TEST,
  DB_NAME_TEST,
} = process.env;

const DB_URI = `mongodb+srv://${DB_USER_TEST}:${DB_PASS_TEST}@${DB_CLUSTER_TEST}.mongodb.net/${DB_NAME_TEST}?retryWrites=true&w=majority`;

const goodUser = {
  name: 'user1',
  cin: 'H1422348',
  age: '28',
  phone: '0623111459',
  zipCode: '46000',
  city: 'Safi',
  address: 'address1',
  vaccination: 'vaccin1',
  email: 'email-2@gmail.com',
  password: '1234567890',
};

describe('POST /register', () => {
  before(async () => {
    await mongoose.connect(DB_URI);
    const collections = await mongoose.connection.db.collections();
    collections.forEach(async (collection) => {
      await collection.drop();
    });
  });

  it('User Register', async () => {
    const response = await request(app)
      .post('/register')
      .send(goodUser)
      .expect(200);
    expect(response.body.message).to.equal('User was created successfully.');
  });
  it('User Exists', async () => {
    const response = await request(app)
      .post('/register')
      .send(goodUser)
      .expect(409);
    expect(response.body.message).to.equal('User already exists.');
  });
});

describe('POST /verify', () => {
  after(async () => {
    await mongoose.disconnect();
  });

  it('Verify vaccination: already vaccinated', async () => {
    const response = await request(app)
      .post('/verify')
      .send({ cin: goodUser.cin, vaccination: goodUser.vaccination })
      .expect(200);
    expect(response.body.message).to.equal('You are already vaccinated.');
  });
  it('Verify vaccination: not vaccinated', async () => {
    const response = await request(app)
      .post('/verify')
      .send({ cin: 'A123456', vaccination: goodUser.vaccination })
      .expect(200);
    expect(response.body.message).to.equal('You are not vaccinated.');
  });
});
