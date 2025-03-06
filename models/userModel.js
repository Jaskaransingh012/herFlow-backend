const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleAccessToken: { type: String },
  googleRefreshToken: { type: String },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }],
  cycle: {  // Changed from cycles array to single reference
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cycle'
  }
});
const User = mongoose.model('User', userSchema);

module.exports = User;