// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    messages: [
        {
            text: { type: String, required: true },
            sender: { type: String, enum: ["user", "bot"], required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;