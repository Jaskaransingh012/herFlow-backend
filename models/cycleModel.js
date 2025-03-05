const mongoose = require('mongoose');

const CycleSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  cycleStartDate: { type: Date, required: true },
  cycleEndDate: { type: Date, required: true },
  cycleLength: { type: Number }, // Auto-calculated based on start & end dates
  lutealPhaseLength: { type: Number, default: 14 }, // Can be user-input or predicted
  symptoms: [
    {
      date: { type: Date, required: true },
      flowIntensity: { type: String, enum: ['Light', 'Medium', 'Heavy', 'Spotting'] },
      cramps: { type: String, enum: ['None', 'Mild', 'Moderate', 'Severe'] },
      mood: { type: String, enum: ['Happy', 'Irritable', 'Sad', 'Anxious', 'Neutral'] },
      bodyTemperature: { type: Number }, // In °C or °F
      cervicalMucus: { type: String, enum: ['Dry', 'Sticky', 'Creamy', 'Egg White', 'Watery'] },
      ovulationTestResult: { type: String, enum: ['Positive', 'Negative', 'Not Taken'] },
      additionalNotes: { type: String }
    }
  ],
  predictions: {
    nextCycleStart: { type: Date },
    nextOvulationDate: { type: Date },
    fertileWindow: [{ type: Date }] // Array of dates indicating fertile period
  },
  lifestyleFactors: {
    sleepHours: { type: Number }, // Average sleep duration
    stressLevel: { type: String, enum: ['Low', 'Moderate', 'High'] },
    exerciseRoutine: { type: String, enum: ['Sedentary', 'Light', 'Moderate', 'Intense'] }
  },
  createdAt: { type: Date, default: Date.now }
});

const Cycle =  mongoose.model('Cycle', CycleSchema);
module.exports = Cycle;
