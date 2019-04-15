const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Fetched All user\'s contacs'
  });
});

router.get('/:contactId', (req, res, next) => {
  const id = req.params.contactId;
  res.status(200).json({
    message: 'fetched contact',
    contactId: id
  });
});

router.post('/', (req, res, next) => {
  const contactData = req.body.contact;
  res.status(200).json({
    message: 'create a new contact',
    contact: contactData
  });
});

router.patch('/:contactId', (req, res, next) => {
  const id = req.params.contactId;
  res.status(200).json({
    message: 'updated contact',
    contactId: id
  });
});

router.delete('/:contactId', (req, res, next) => {
  const id = req.params.contactId;
  res.status(200).json({
    message: 'deleted contact',
    contactId: id
  });
});

module.exports = router;