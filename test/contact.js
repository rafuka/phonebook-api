

const mongoose = require("mongoose");
const Contact = require('../api/models/Contact');
const User = require('../api/models/User');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      done();
    })
  })

  describe('/POST users/signup', () => {
    it('should POST (create) a new user', (done) => {
      let user = {
        name: "Test User",
        email: "test@email.com",
        password: "1234567"
      }
      chai.request(server).post('/users/signup').send(user).end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('user created');
        res.body.should.have.property('user');
        res.body.should.have.property('token');
        done();
      })
    })
  })
});


  
