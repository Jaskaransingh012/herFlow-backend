// controllers/chatController.js
const Chat = require('../models/aiChatModel');
const User = require('../models/userModel');
const { generateHealthResponse } = require('../config/openAi'); // Import the response generator

const chatController = {
    // Start a new chat session and generate a health response
    startChat: async (req, res) => {
        try {
            const { userId, message, cycleData } = req.body;

            // Validate input
            if (!userId || !message) {
                return res.status(400).json({ error: 'userId and message are required' });
            }

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            // Generate health response from the AI
            const botResponse = await generateHealthResponse(message, cycleData);

            // Create a new chat with both user message and bot response
            const newChat = new Chat({
                userId,
                messages: [
                    {
                        text: message,
                        sender: 'user',
                        timestamp: new Date(),
                    },
                    {
                        text: botResponse,
                        sender: 'bot',
                        timestamp: new Date(),
                    },
                ],
            });

            // Save the chat to the database
            await newChat.save();
            res.status(201).json(newChat);

        } catch (error) {
            console.error('Error in startChat:', error);
            res.status(500).json({ error: 'Failed to start chat: ' + error.message });
        }
    },

    // Get chat history
    getChatHistory: async (req, res) => {
        try {
            const { userId } = req.params;

            // Find chat and populate user details
            const chat = await Chat.findOne({ userId })
                .populate('userId', 'username email');

            if (!chat) return res.status(404).json({ error: 'Chat not found' });
            res.json(chat.messages);

        } catch (error) {
            console.error('Error in getChatHistory:', error);
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = chatController;