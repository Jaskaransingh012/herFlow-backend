const express = require('express');
const router = express.Router();
const { getSteps } = require('../controller/stepController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getSteps);

module.exports = router;