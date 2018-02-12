process.env.Node_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHTTP = require('chai-http');
const server = require('../server.js');
const knex = require('../db/knex.js');

chai.use(chaiHTTP);

describe('Client Routes', () => {
  it('Should return the homepage', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html
    })
    .catch(error => {
      throw error;
    })
  })


});