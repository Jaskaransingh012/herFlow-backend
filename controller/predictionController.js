const { generateCyclePredictions } = require('../config/openAi');

// Standalone prediction endpoint
const predictCycle = async (req, res) => {
  try {
    const { cycleStartDate, cycleEndDate, lutealPhaseLength, symptoms, lifestyleFactors } = req.body;
    
    const predictions = await generateCyclePredictions({
      cycleStartDate,
      cycleEndDate,
      lutealPhaseLength,
      symptoms,
      lifestyleFactors
    });

    res.json({ 
      success: true, 
      data: predictions 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error generating predictions',
      error: error.message 
    });
  }
};

module.exports = { predictCycle };