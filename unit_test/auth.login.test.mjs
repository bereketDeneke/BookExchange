import * as chai from 'chai';
import supertest from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

const { expect } = chai;
const serverUrl = `${process.env.SERVER_URL}:${process.env.PORT}/api/auth`;
const request = supertest(serverUrl);

describe('User Authentication API Tests', function () {
  let token; // Will store JWT token from login
  const testUser = {
    username: "Bereket Siraw Deneke" ,
    email: `bd2249@nyu.edu`,
    password: '!@#passw0rd23'
  };
  
  // Test Login Endpoint
  describe('POST /login', function () {
    it('should log in an existing user successfully', async function () {
      const res = await request.post('/login').send({ email: testUser.email, password: testUser.password, rememberMe: true });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Login successful');
      token = res.body.token;
    });

    it('should not log in with incorrect password', async function () {
      const res = await request.post('/login').send({ email: testUser.email, password: 'WrongPassword123' });
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid email or password');
    });

    it('should validate password length', async function () {
      const res = await request.post('/login').send({ email: testUser.email, password: 'short' });
      expect(res.status).to.equal(400);
      expect(res.body.message[0]).to.include('Password should have at least 8 characters');
    });
  });

  // Test Logout Endpoint
  describe('POST /logout', function () {
    it('should log out the user successfully', async function () {
      const res = await request.post('/logout').set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Logged out successfully');
    });
  });
});
