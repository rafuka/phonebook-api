const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    return next();
  }
  catch(err) {
    const error = new Error('Auth failed');
    error.status = 401;
    error.server = err;
    return next(error);
  }
}