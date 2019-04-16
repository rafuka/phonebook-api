const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    match: /^\+?\d{6,12}$/
  },
  address: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

module.exports = mongoose.model('Contact', contactSchema);