const express = require('express');
const router = express.Router();

router.get('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  res.status(200).json({
    message: 'Fetch user data',
    id: userId
  });
});

router.post('/', (req, res, next) => {

  res.status(200).json({
    message: 'Created new user',
  });
});

module.exports = router;

