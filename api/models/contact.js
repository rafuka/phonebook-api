const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  phone: String,
  address: String,
});

module.exports = mongoose.model('Contact', contactSchema);