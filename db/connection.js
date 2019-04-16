module.exports = function () {

  const mongoose = require('mongoose');
  mongoose.set('useCreateIndex', true);

  const dbUrl = `mongodb://${process.env.DATABASE_URL}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

  mongoose.connect(dbUrl, {
    useNewUrlParser: true
  }, (err, connection) => {
    if (err) {
      console.error('There was an error connecting to the database');
      console.error(err);
      process.exit(1);
    }
    else {
      console.log(`Connected successfully to database ${process.env.DATABASE_NAME} at ${process.env.DATABASE_URL}:${process.env.DATABASE_PORT}`);
    }
  });

  const connection = mongoose.connection;

  return connection;
}