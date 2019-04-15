const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const contactRouter = require('./api/routes/contacts');
const userRouter = require('./api/routes/users');

/* =======  MIDDLEWARE  ======= */
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow cors
app.use(() => {
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
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message || 'There was an error.',
      status: err.status
    }
  })
});


module.exports = app;