import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose'; // To close DB connection
import dbConnect from '../utils/db.js';
import BookOffer from '../models/Offer.js';

const { expect } = chai;
const serverUrl = `${process.env.SERVER_URL}:${process.env.PORT}/api`;
const request = supertest(serverUrl);

describe('POST /api/book/getAllBooks', function () {
  const testUser = {
    username: "Bereket Siraw Deneke" ,
    email: `bd2249@nyu.edu`,
    password: '!@#passw0rd23'
  };
  let token;
  let books;

  before(async () => {
    await dbConnect();
    books = await BookOffer.findAll();
    const loginRes = await request
      .post('/auth/login') 
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    token = loginRes.headers['set-cookie'][0].split(';')[0].split('=')[1];
    
  });

  after(async () => {
    await mongoose.connection.close(); // Close DB connection
  });


  it('should return a list of books with the correct structure and data', async function(){
    this.timeout = 30000;
    const res = await request
      .get('/book/getAllBooks')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', `authorization=${token}`);

    expect(res.status).to.equal(200);

    // Validate response structure
    expect(res.body).to.have.property('books').that.is.an('array');
    expect(res.body.books).to.have.length(books.length);

    // Validate each book in the response
    res.body.books.forEach((book, index) => {
      expect(book).to.deep.include({
        title: books[index].title,
        description: books[index].description,
        rating: books[index].rating,
        status: books[index].status,
        type: books[index].type,
        price: books[index].price,
      });
      
      // Validate additional properties
      expect(book).to.have.property('_id').that.is.a('string');
      expect(book).to.have.property('userId', books[index].userId.toString());
      expect(book).to.have.property('createdAt').that.is.a('string');
      expect(book).to.have.property('updatedAt').that.is.a('string');
    });
  });

  it('should return 401 if the Authorization header is missing', async () => {
    const res = await request.get('/book/getAllBooks');
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Missing token in cookies');
  });

  it('should return 401 if the token is invalid', async () => {
    const res = await request
      .get('/book/getAllBooks')
      .set('Authorization', 'Bearer invalid_token')
      .set('Cookie', `authorization=invalid_token`);
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Invalid token');
  });

  it('should return 405 for unsupported HTTP methods', async () => {
    const res = await request.post('/book/getAllBooks'); // Using POST instead of GET
    expect(res.status).to.equal(405);
    expect(res.body).to.deep.equal({});
  });
});
