const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const contactController = require('../controllers/contacts');
router.use(auth);

router.get('/', contactController.getAllContacts);
router.post('/', contactController.createContact);
router.get('/:contactId', contactController.getContact);
router.patch('/:contactId', contactController.updateContact);
router.delete('/:contactId', contactController.deleteContact);

module.exports = router;