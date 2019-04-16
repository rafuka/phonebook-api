module.exports = function () {

  const mongoose = require('mongoose');
  mongoose.set('useCreateIndex', true);
  mongoose.connect(`mongodb://${process.env.DATABASE_URL}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`, {
    useNewUrlParser: true
  }, (err, connection) => {
    if (err) {
      console.error('There was an error connecting to the database');
      process.exit(1);
    }
    else {
      console.log(`Database connection successful at ${process.env.DATABASE_URL}:${process.env.DATABASE_PORT}`);
    }
  });

  const connection = mongoose.connection;

  return connection;
}