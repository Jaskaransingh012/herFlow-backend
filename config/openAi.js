const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Generate comprehensive menstrual cycle predictions using Google's Gemini API
 * @param {Object} data - Cycle data for prediction (based on CycleSchema)
 * @returns {Object} - Predictions object matching the CycleSchema.predictions structure
 */
const generateCyclePredictions = async (data) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-pro-exp-02-05",
      generationConfig: {
        temperature: 0.3,
        response_mime_type: "application/json",
      },
    });

    const prompt = `
      As a menstrual cycle prediction expert, analyze the provided user cycle data and generate a JSON object with:
      
      - "nextCycleStart": Date (YYYY-MM-DD) for next cycle start
      - "nextOvulationDate": Date (YYYY-MM-DD) for predicted ovulation
      - "fertileWindow": Array of 5 dates (YYYY-MM-DD) around ovulation
      - "nextPeriodDate": Date (YYYY-MM-DD) for next period
      - "nextCyclePhases": Array of objects with {date: YYYY-MM-DD, phase: string}
      - "sleepRecommendations": String with ONLY the recommended sleep duration range (e.g., "7-9 hours").
      - "lifestyleChangeRecommendations": String with VERY SHORT lifestyle tips (1-2 sentences max).

      Use data: ${JSON.stringify(data)}.
      Return valid JSON with ALL requested fields.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let predictions;
    try {
      const jsonString = text.replace(/```json|```/g, "").trim();
      predictions = {
        nextCycleStart: null,
        nextOvulationDate: null,
        fertileWindow: [],
        nextPeriodDate: null,
        nextCyclePhases: [],
        sleepRecommendations: '',
        lifestyleChangeRecommendations: '',
        ...JSON.parse(jsonString),
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Invalid JSON response from AI");
    }

    // Date conversion with safety checks
    const parseDate = (date) => date ? new Date(date) : null;
    
    predictions.nextCycleStart = parseDate(predictions.nextCycleStart);
    predictions.nextOvulationDate = parseDate(predictions.nextOvulationDate);
    predictions.nextPeriodDate = parseDate(predictions.nextPeriodDate);
    
    predictions.fertileWindow = Array.isArray(predictions.fertileWindow) 
      ? predictions.fertileWindow.map(parseDate).filter(d => d)
      : [];

    predictions.nextCyclePhases = Array.isArray(predictions.nextCyclePhases)
      ? predictions.nextCyclePhases
          .filter(p => p.date && p.phase)
          .map(p => ({ 
            date: parseDate(p.date), 
            phase: p.phase 
          }))
      : [];

    return predictions;
  } catch (error) {
    console.error("AI Prediction Error:", error);
    throw new Error("Failed to generate predictions");
  }
};

/**
 * Generate a health-related response acting as a health consultant using Google's Gemini API
 * @param {string} userMessage - The user's health-related question or message
 * @returns {Promise<string>} - The health consultant's response as a string
 */
// Backend (generateHealthResponse.js)
const generateHealthResponse = async (userMessage, cycleData) => {
  try {
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('User message must be a non-empty string');
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-pro-exp-02-05",
      generationConfig: {
        temperature: 0.5,
        response_mime_type: "text/plain",
        maxOutputTokens: 100,
      },
    });

    const cycleInfo = cycleData ? `
      User's Menstrual Cycle Data:
      - Cycle Length: ${cycleData.cycleLength} days
      - Period Duration: ${cycleData.periodDuration} days
      - Last Period Start: ${new Date(cycleData.lastPeriodStart).toLocaleDateString()}
      - Symptoms: ${cycleData.symptoms?.join(', ') || 'None reported'}
    ` : 'No cycle data available';

    const prompt = `
      You are a professional health consultant for HerFlo. Current cycle data: ${cycleInfo}
      Provide personalized advice considering this cycle information. Focus on menstrual health, symptom management, and cycle tracking tips. 
      Keep responses 50-70 words, friendly and supportive. If cycle data is missing, ask politely to update cycle tracking first.
      For website queries: "HerFlo is a menstrual cycle tracking website created by Team Pookies. Contact: 6280341055 or jaskaransingh_1@outlook.com."
      User message: "${userMessage}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    const maxCharLimit = 500;
    if (text.length > maxCharLimit) {
      text = text.substring(0, maxCharLimit).trim() + "...";
    }

    return text;
  } catch (error) {
    console.error("Health Response Error:", error);
    throw new Error('Failed to generate health response');
  }
};

module.exports = {
  generateCyclePredictions,
  generateHealthResponse,
};