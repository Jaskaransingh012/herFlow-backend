const Step = require('../models/stepsModel');
const User = require('../models/userModel');
const { getStepData } = require('../utils/googleFit');

const getSteps = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.googleAccessToken) {
      return res.status(400).json({ message: 'Google Fit not authenticated' });
    }

    const today = new Date();
    const startTimeMillis = new Date(today.setHours(0, 0, 0, 0)).getTime() * 1000000;
    const endTimeMillis = Date.now() * 1000000;

    const stepCount = await getStepData(user.googleAccessToken, startTimeMillis, endTimeMillis);

    const step = new Step({
      userId: req.user.id,
      date: new Date(),
      stepCount,
    });
    await step.save();

    res.json({ date: step.date, stepCount: step.stepCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching steps', error });
  }
};

module.exports = { getSteps };