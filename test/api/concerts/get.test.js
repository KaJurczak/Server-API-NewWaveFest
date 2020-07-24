const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/concerts', () => {
  before(async () => {
    const testConOne = new Concert({ performer: 'Samuel Li', genre: 'Rock', price: 60, day: 3, image: 'test.jpg' });
    await testConOne.save();
  
    const testConTwo = new Concert({ performer: 'Amanda Jonson', genre: 'Pop', price: 20, day: 3, image: 'test.jpg' });
    await testConTwo.save();
  });
  
  after(async () => {
    await Concert.deleteMany({ performer: 'Samuel Li' });
    await Concert.deleteMany({ performer: 'Amanda Jonson' });
  });

  it('/performer/:performer should return performers filtered by their name ', async () => {
    const res = await request(server).get('/api/concerts/performer/Samuel%20Li');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });

  it('/genre/:genre should return performers filtered by genre ', async () => {
    const res = await request(server).get('/api/concerts/genre/Pop');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.not.be.null;
  });

  it('/price/:price_min/:price_max should return performers filtered by price ', async () => {
    const res = await request(server).get('/api/concerts/price/10/40');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.not.be.null;
  });

  it('/day/:day should return performers by day ', async () => {
    const res = await request(server).get('/api/concerts/day/3');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.not.be.null;
  });
});