const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const oauth2Client = require('../config/googleAuth');

const register = async (req, res) => {
  console.log("first");
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'User already exists' });

    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Error registering user', error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging in', error });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting user', error });
  }
}

const googleAuth = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    scope: ['https://www.googleapis.com/auth/fitness.activity.read'],
  });
  res.redirect(url);
};

const googleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    const user = await User.findById(req.user.id);
    user.googleAccessToken = tokens.access_token;
    user.googleRefreshToken = tokens.refresh_token;
    await user.save();
    res.redirect('/'); // Redirect to frontend or send success response
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error in Google auth callback', error });
  }
};

module.exports = { register, login, googleAuth, googleCallback, getUser };