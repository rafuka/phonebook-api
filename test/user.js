const User = require('../api/models/User');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Testing Users endpoints', () => {
  before((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  describe('/POST users', () => {
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
      });
    });

    it('Should POST (login) an user', (done) => {
      let user = {
        email: "test@email.com",
        password: "1234567"
      }

      chai.request(server).post('/users/login').send(user).end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Auth successful');
        res.body.should.have.property('token');
        done();
      })
    })
  });
});