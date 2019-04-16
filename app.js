const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const dotenv = require('dotenv');
dotenv.config();

const contactRouter = require('./api/routes/contacts');
const userRouter = require('./api/routes/users');

const dbConnection = require('./db/connection')();


/* =======  MIDDLEWARE  ======= */
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
    res.status(200).json({});
  }

  next();
});

/* =======  ROUTES  ======= */
app.use('/users', userRouter);
app.use('/contacts', contactRouter);

app.use((req, res, next) => {
  const error = new Error('Not found.');
  error.status = 404;
  next(error);
});

/* =======  ERROR HANDLING ======= */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  if (err.server && process.env.NODE_ENV !== 'test') console.error(err.server);
  res.json({
    error: {
      message: err.message || 'There was an error.',
      status: err.status
    },
  })
});


module.exports = app;