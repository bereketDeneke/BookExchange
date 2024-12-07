import * as chai from 'chai';
import dbConnect from '../utils/db.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import supertest from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

const { expect } = chai;
const serverUrl = `${process.env.SERVER_URL}:${process.env.PORT}/api/auth`;
const request = supertest(serverUrl);

describe('POST /api/auth/register authentication test', function () {
      this.timeout(10000);
      const testUser = {
        username: "Bereket Deneke",
        email: `test12455@nyu.edu`,
        password: "!@#passw0rA23",
        confirmPassword: "!@#passw0rA23",
      };

      before('Remove the sample user', async() => {
        await dbConnect();
        await User.deleteOne({ email: testUser.email }).exec();;  
      });

      it('should register a new user successfully', async function () {
        const res = await request.post('/register').send(testUser);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message', 'User registered successfully');
      });
    
      it('should not register an existing user', async function () {
        const res = await request.post('/register').send(testUser);
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message', 'User already exists');
      });
    
      it('should validate email format', async function () {
        const res = await request.post('/register').send({ ...testUser, email: 'invalid-email' });
        expect(res.status).to.equal(400);
        expect(res.body.message[0]).to.include('Invalid email format');
      });

    after('Remove the sample user', async() => {
      await dbConnect();
      await User.deleteOne({ email: testUser.email }).exec();
      await mongoose.connection.close();
    });
});