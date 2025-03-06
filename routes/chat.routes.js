// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controller/aiChatController');

router.post('/start', chatController.startChat);
router.get('/history/:userId', chatController.getChatHistory);

module.exports = router;