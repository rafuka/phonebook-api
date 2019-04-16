

const mongoose = require("mongoose");
const Contact = require('../api/models/Contact');
const User = require('../api/models/User');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const jwt = require('jsonwebtoken');
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
  before((done) => {
    User.remove({}, (err) => {
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

describe('Contacts', () => {
  let token;
  before((done) => {
    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: "Test User",
      email: "email@test.com",
      password: "1234567"
    });

    user.save().then(newUser => {
      token = jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email
      },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        });

      let contact = new Contact({
        _id: new mongoose.Types.ObjectId(),
        name: "Test contact",
        phone: "07869876",
        address: "Test address",
        user_id: newUser._id
      });

      return contact.save();
    }).then(newContact => {
      done();
    });
  });

  describe('/GET contacts', () => {
    it('should get all of user\'s contacts', (done) => {
      chai.request(server).get('/contacts').set('Authorization', 'Bearer ' + token).end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('count').eql(1);
        res.body.should.have.property('contacts');
        res.body.should.have.property('requests');
        done();
      });
    });
  });

  describe('/POST contacts', () => {
    it('should create a new contact', (done) => {
      let newContact = {
        name: "new test contact name",
        phone: "9876986",
        address: "This is a new test address"
      }

      chai.request(server).post('/contacts').set('Authorization', 'Bearer ' + token).send(newContact).end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('createdContact');
        done();
      });
    });
  });
});



