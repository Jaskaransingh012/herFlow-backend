const express = require('express');
const router = express.Router();
const { register, login, googleAuth, googleCallback, getUser } = require('../controller/authController');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', validateRequest, register);
router.post('/login', validateRequest, login);
router.get('/user', authMiddleware, getUser);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router; 