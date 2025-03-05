const { GoogleGenerativeAI } = require("@google/generative-AI");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Generate menstrual cycle predictions using Google's Gemini API
 * @param {Object} data - Cycle data for prediction
 * @returns {Object} - Predictions (nextCycleStart, nextOvulationDate, fertileWindow)
 */
const generateCyclePredictions = async (data) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-pro-exp-02-05", // Updated model name
      generationConfig: {
        temperature: 0.3,
        response_mime_type: "application/json"
      }
    });

    const prompt = `As a menstrual cycle prediction expert, analyze this cycle data and return JSON with:
    - nextCycleStart (date as YYYY-MM-DD)
    - nextOvulationDate (date as YYYY-MM-DD)
    - fertileWindow (array of 5 dates YYYY-MM-DD)
    Use calculations based on cycle length, luteal phase, and historical data.
    
    User Data: ${JSON.stringify(data)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse JSON response
    const jsonString = text.replace(/```json|```/g, '').trim();
    const predictions = JSON.parse(jsonString);

    // Validation
    const isValid = (
      predictions.nextCycleStart &&
      predictions.nextOvulationDate &&
      Array.isArray(predictions.fertileWindow) &&
      predictions.fertileWindow.every(d => typeof d === 'string')
    );

    if (!isValid) throw new Error("Invalid prediction format from AI");

    return predictions;
  } catch (error) {
    console.error("AI Prediction Error:", error);
    throw new Error("Failed to generate predictions");
  }
};

module.exports = {
  generateCyclePredictions
};