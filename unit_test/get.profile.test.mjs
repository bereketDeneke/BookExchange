import * as chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import dbConnect from '../utils/db.js';
import User from '../models/User.js';
import BookOffer from '../models/Offer.js';
import mongoose from 'mongoose'; 

const JWT_SECRET = '$ecret';
const { expect } = chai;
const serverUrl = `${process.env.SERVER_URL}:${process.env.PORT}/api`;
const request = supertest(serverUrl);

describe('GET /api/profile/getProfile', function(){
  let token;
  let user;
  let bookOffers;

  const testUser = {
    username: "Bereket Siraw Deneke" ,
    email: `bd2249@nyu.edu`,
    password: '!@#passw0rd23'
  };

  before(async () => {
    await dbConnect();
    user = await User.findOne({ email: testUser.email }).exec();
    bookOffers = await BookOffer.findAll({userId: user._id});
    const loginRes = await request
      .post('/auth/login') 
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    token = loginRes.headers['set-cookie'][0].split(';')[0].split('=')[1];
   
  });

  it('should return 405 for unsupported HTTP methods', async () => {
    const res = await request.post('/profile/getProfile'); // Using POST instead of GET
    expect(res.status).to.equal(405);
    expect(res.body).to.deep.equal({});
  });

  it('should return 401 if Authorization header is missing', async () => {
    const res = await request.get('/profile/getProfile');
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Missing or invalid Authorization header');
  });

  it('should return 401 if token is invalid', async () => {
    const res = await request
      .get('/profile/getProfile')
      .set('Authorization', 'Bearer invalid_token');
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Invalid token');
  });

  it('should return 404 if user is not found', async () => {
    console.log(JWT_SECRET);
    const invalidToken = jwt.sign({ userId: '9753b45df5d9070d0f011ec7' }, JWT_SECRET, { expiresIn: '7d'});
    const res = await request
      .get('/profile/getProfile')
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('message', 'User not found');
  });

  it('should return user profile and book offers for a valid request', async()=>{
    const res = await request
      .get('/profile/getProfile')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.include({
      username: user.username,
      streaks: user.streaks,
      email: user.email,
      profilePicture: "data:image/png;base64," + user.profilePicture.toString('base64'),
    });
  });


  after(async () => {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');

    // Exit the process explicitly
    process.exit(0);
  });

});
