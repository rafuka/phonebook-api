const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  login: (req, res, next) => {
    const userData = req.body;

    User.find({ email: userData.email }).exec()
      .then(user => {
        if (user.length < 1) {
          const error = new Error('The email you provided is not registered in our database');
          error.status = 404;
          return next(error)
        }

        const authUser = user[0];

        bcrypt.compare(userData.password, authUser.password, (err, match) => {
          if (err) {
            const error = new Error('Couldn\'t login user');
            error.status = 500;
            error.server = err;
            return next(error);
          }

          if (!match) {
            return res.status(404).json({
              message: 'Incorrect password'
            });
          }

          const token = jwt.sign({
            id: authUser._id,
            name: authUser.name,
            email: authUser.email
          },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            });

          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
        });
      })
      .catch(err => {
        const error = new Error('There was an error querying the database');
        error.status = 500;
        error.server = err;
        return next(error);
      })
  },

  signup: (req, res, next) => {
    const userData = req.body;

    User.find({ email: userData.email }).exec()
      .then(user => {
        if (user.length >= 1) {
          const error = new Error('The email provided is already registered.');
          error.status = 422;
          return next(error);
        }

        bcrypt.hash(userData.password, 10, (err, hash) => {
          if (err) {
            const error = new Error('Couldn\'t create user');
            error.status = 500;
            error.server = err;
            return next(error);
          }

          const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            name: userData.name,
            email: userData.email,
            password: hash
          });

          newUser.save()
            .then(user => {
              const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email
              },
                process.env.JWT_KEY,
                {
                  expiresIn: "1h"
                });

              return res.status(201).json({
                message: "user created",
                user: user,
                token: token
              });
            })
            .catch(err => {
              const error = new Error('Couldn\'t create user');
              error.status = 500;
              error.server = err;
              return next(error);
            });
        });
      })
  }
}