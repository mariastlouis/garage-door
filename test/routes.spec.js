process.env.Node_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHTTP = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHTTP);

describe('Client Routes', () => {
   it('Should return the homepage', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(error => {
      throw error;
    });
  });

  it('Should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/noRoute')
      .then(() => { })
      .catch(error => {
        error.should.have.status(404)
      })
  });
});

describe('API Routes', () => {
   beforeEach((done) => {
    knex.seed.run()
    .then(() => {
      done();
    });
  });


  describe('get /api/v1/items', () => {
    it('should get all items', () => {
      return chai.request(server)
      .get('/api/v1/items')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.stuff[0].should.have.property('id');
        response.body.stuff[0].should.have.property('reason');
        response.body.stuff[0].should.have.property('name');
        response.body.stuff[0].should.have.property('cleanliness');

      })
      .catch(error => {
        throw error;
      });
    });
    it('should return an error if path is incorrect', () => {
      return chai.request(server)
      .get('/api/v1/stuff')
      .then(() => { 
      })
      .catch(error => {
        error.should.have.status(404);
      });
    });
  });

  describe('GET /api/v1/items/:id', () => {
    it('should return an item with a specific id', () => {
       let itemId;
       return chai.request(server)
       .get('/api/v1/items')
       .then(response => {
        itemId = response.body.stuff[0].id;
       })
      .then(() => {
        return chai.request(server)
        .get(`/api/v1/items/${itemId}`)
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.stuff[0].should.have.property('id');
          response.body.stuff[0].should.have.property('reason');
          response.body.stuff[0].should.have.property('name');
          response.body.stuff[0].should.have.property('cleanliness');
        })      
      })
  });  


    it('should return an error if the id is not found', () => {
      return chai.request(server)
      .get('/api/v1/items/9999999')
      .then(response => { })
    .catch(error => {
      error.should.have.status(404)
      error.response.body.error.should.equal('Cound not find item with the id of 9999999')
    })
  })
})

describe('POST /api/v1/items', () => {
  it('should post new items', () => {
    return chai.request(server)
    .post('/api/v1/items')
    .send({
      name: 'love lost', reason:'jelousy', cleanliness:'Dusty'
    })
    .then(response => {
      response.should.have.status(201)
      response.should.be.json;
      response.body.should.have.property('id');
    })
    .catch(error => {
      throw error;
    })
  })
  
  it('should throw an error if required parameters are not included', () => {
    return chai.request(server)
    .post('/api/v1/items')
    .send({
      name: 'old shoes', cleanliness: 'Dusty'
    })
    .then(response => { })
    .catch (error => {
      error.should.have.status(422)
      error.response.body.error.should.equal('You are missing the required parameter reason')
    })

  })
})

describe('PATCH /api/v1/items', () => {
  it('should be able to patch the cleanliness of an item', () => {
   let itemId;
   return chai.request(server)
   .get('/api/v1/items')
   .then(response => {
    itemId = response.body.stuff[0].id;
   })
   .then(() => {
     return chai.request(server)
    .patch(`/api/v1/items/${itemId}`)
    .send({
      cleanliness: 'Dusty'
    })
    .then(response => {
      response.should.have.status(202);
      response.text.should.equal('Accepted')
    })
    .catch(error => {
      throw error
    })


   })
  })
  it('should thrown an error if the item id is not found', () => {
    return chai.request(server)
    .patch('/api/v1/items/99999')
    .send({
      cleanliness: 'Dusty'
    })
    .then(response => { })
    .catch (error => {
      error.should.have.status(404)
    })


  })
})



});